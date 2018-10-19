import path from 'path';
import * as FileService from '../../services/file.service';
import LogisticsService from '../../services/logistics.service';
import * as JobService from '../../services/job.service';
import {ForbidenError, LogicError, NotFound} from '../../errors';
import * as Enum from '../../config/enum';
import database from "../../config/database";
import * as Helper from '../../utils/helper';
import * as VehicleService from '../../services/vehicle.service';
import * as StopService from '../../services/stop.service';
import * as FleetService from '../../services/fleet.service';
import * as PlanService from '../../services/plan.service';
import * as TaskService from '../../services/task.service';
import ExportService from '../../services/export.service';

/**
 * Upload file and save to database
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function upload(req, res) {
  let file = req.files[0];
  let body = req.body;
  let templateType = body.template_type;
  let password = body.password;
  let currentUser = req.currentUser;

  if (!file) {
    throw new ForbidenError('Can not upload file.');
  }

  const filePath = path.resolve(__dirname, '../../../uploads/' + file.filename);
  let fileObj = await FileService.upload(currentUser.id, file, templateType);
  let savedFile = await FileService.save(fileObj);

  if (!savedFile) {
    await FileService.removeFromLocal(filePath);
    throw new ForbidenError('Save file error.');
  }

  let excelData = await FileService.parseData(savedFile, password);

  // Check if excel is valid
  try {
    VehicleService.parseSheet(excelData, templateType);
    StopService.parseSheet(excelData, templateType);

  } catch (e) {
    await FileService.removeFromLocal(filePath);
    throw e;
  }

  return res.json({
    error: false,
    data: {
      file_id: savedFile.get('id')
    }
  });
}

/**
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */
export async function createJob(req, res) {
  const currentUser = req.currentUser;
  const body = req.body;
  const fileId = body.file_id;
  const password = body.password;

  await database.transaction(async transaction => {
    const file = await FileService.findByIdAndUserId(fileId, currentUser.id);
    if (!file) {
      throw new NotFound('File not found');
    }

    let jobObj = {
      user_id: currentUser.id,
      status: Enum.TASK_STATUS.init,
      file_id:file.id,
      type: file.template_type,
      date_depart: body.date_depart,
      use_toll: body.use_toll,
      use_time_routing_mode: body.use_time_routing_mode,
      use_balance_vehicle_mode: body.use_balance_vehicle_mode,
      load_factor: body.load_factor
    };

    jobObj = Helper.copyProperties(body, jobObj, [
      'use_constraints', 'use_system_zone', 'balance_by', 'distance_leg_limit', 'leg_limit'
    ]);

    let job = await JobService.create(jobObj, {transaction: transaction});
    job = await JobService.findById(job.id, {transaction: transaction});

    let excelData = await FileService.parseData(file, password);
    await VehicleService.parseAndSaveToDB(excelData, job.id, file.template_type, transaction);
    await StopService.parseAndSaveToDB(excelData, job.id, file.template_type, transaction);

    let common = job.toJSON();
    let stops = await StopService.findByJobId(job.id, transaction);
    let vehicles = await VehicleService.findByJobId(job.id, transaction);

    // save logistics request
    let task = await TaskService.init(
      job.id,
      JSON.stringify(common),
      JSON.stringify(stops),
      JSON.stringify(vehicles),
      currentUser.email,
      null,
      file.template_type,
      Enum.ACTION.create_routes,
      transaction
    );

    // send request API
    task = await LogisticsService.createRoutes(task, transaction);

    return res.json({
      error: false,
      data: {
        task_id: task.id,
        job_id: job.id
      }
    });
  });
}

/**
 * Get list fleets
 *
 * @param req
 * @param res
 * @return {Promise<*>}
 */
export async function getStatus(req, res) {
  let taskId = req.body.task_id;
  let currentUser = req.currentUser;

  let task = await TaskService.findById(taskId);
  if (!task) {
    throw new NotFound(`Task with id ${taskId} is not found`);
  }

  let job = await JobService.findOwnJob(task.job_id, currentUser.id);
  if (!job) {
    throw new NotFound(`Task with id ${taskId} is not found`);
  }

  if (task.status === Enum.TASK_STATUS.init ||
    task.status === Enum.TASK_STATUS.success ||
    task.status === Enum.TASK_STATUS.failed ||
    task.status === Enum.TASK_STATUS.cancelled
  ) {
    return res.json({error: false, data: {status: task.status}})
  }

  const transaction = await database.transaction();
  try {
    let taskStatus = await LogisticsService.getStatusAndSave(task, transaction);
    if (taskStatus === true) {
      // commit
      await transaction.commit();
      return res.json({ error: false, data: {status: Enum.TASK_STATUS.success} });
    }

    // commit
    await transaction.commit();
    return res.json({ error: false,
      data: {
        status: Enum.TASK_STATUS.running,
        progress: taskStatus
      }
    })
  } catch (e) {
    // rollback
    await transaction.rollback();
    // log error
    await TaskService.logError(task, e);

    throw e;
  }
}

/**
 * cancel task by id.
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @returns {Promise<void>}
 */
export async function cancelTask(req, res) {
  let taskId = req.body.task_id;
  let currentUser = req.currentUser;

  let task = await TaskService.findById(taskId);
  if (!task) {
    throw new NotFound(`Task not found`);
  }
  
  let job = await JobService.findOwnJob(task.job_id, currentUser.id);
  if (!job) {
    throw new NotFound(`Task not found`);
  }

  if (task.status !== Enum.TASK_STATUS.running && task.status !== Enum.TASK_STATUS.partial_running) {
    throw new LogicError(`Cannot cancel task when task status is ${task.status}`);
  }

  await LogisticsService.cancel(task, currentUser.email);

  return res.json({
    error: false
  })
}

/**
 * Re route
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */
export async function reRoutes(req, res) {
  const currentUser = req.currentUser;
  const body = req.body;
  const jobId = body.job_id;

  await database.transaction( async transaction => {
    let job = await JobService.findOwnJob(jobId, currentUser.id, transaction);

    if (!job) {
      throw new NotFound('Cannot find job');
    }

    let jobObj = {};
    jobObj = Helper.copyProperties(body, jobObj, [
      'date_depart',
      'use_toll',
      'use_time_routing_mode',
      'use_balance_vehicle_mode',
      'load_factor',
      'distance_leg_limit',
      'leg_limit',
      'use_constraints',
      'use_system_zone',
      'balance_by'
    ], true);

    await JobService.update(jobObj, {
      where: {id: jobId},
      transaction: transaction
    });

    job = await JobService.findById(job.id, {transaction});
    let stops = await StopService.findByJobId(job.id, transaction);
    let vehicles = await VehicleService.findByJobId(job.id, transaction);

    let task = await TaskService.init(
      job.id,
      JSON.stringify(job.toJSON()),
      JSON.stringify(stops),
      JSON.stringify(vehicles),
      currentUser.email,
      null,
      Enum.JOB_TYPE.general,
      Enum.ACTION.reset_routes,
      transaction
    );

    await LogisticsService.createRoutes(task, transaction);

    return res.json({
      error: false,
      data: {task_id: task.id, job_id: job.id}
    });
  });
}

/**
 * Download report
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {File}
 */
export async function createDetailReport(req, res) {
  const jobId = req.params.id;
  const { currentUser } = req;
  const job = await JobService.getLogisticsJob(jobId, currentUser.id);

  if (!job) {
    throw new NotFound(`Job with id ${jobId} is not found`);
  }

  let fleet = await JobService.getLastFleet(jobId);
  if (!fleet) {
    throw new NotFound(`Fleet not found for job ID ${jobId}`);
  }

  let foundExport = await ExportService
    .findExistsReport(fleet.id, jobId, currentUser.id, Enum.FILE_TEMPLATE.detail_report);

  let reportFile;
  if (!foundExport) {
    const fullFleet = await FleetService.getFullById(fleet.id);
    const physicalFile = await (new ExportService).createReport(job, fullFleet);
    const fileObj = await FileService.upload(currentUser.id, physicalFile, Enum.FILE_TEMPLATE.detail_report);
    reportFile = await FileService.save(fileObj);

    await ExportService.save({
      user_id: currentUser.id,
      job_id: jobId,
      type: Enum.FILE_TEMPLATE.detail_report,
      file_id: reportFile.id,
      fleet_id: fleet.id
    });

  } else {
    reportFile = foundExport.file;
  }

  return FileService.createFileDownload(reportFile, res);
}

/**
 * Download export master plan
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {File}
 */
export async function createMasterPlanReport(req, res) {
  const jobId = req.params.id;
  const { currentUser } = req;

  const reportTemplate = Enum.FILE_TEMPLATE.master_report;
  const job = await JobService.getLogisticsJob(jobId, currentUser.id);

  if (!job) {
    throw new NotFound(`Job with id ${jobId} is not found`);
  }

  let fleet = await JobService.getLastFleet(jobId);
  if (!fleet) {
    throw new NotFound(`Fleet not found for job ID ${jobId}`);
  }

  let reportFile;
  let foundReport = await ExportService.findExistsReport(fleet.id, jobId, currentUser.id, reportTemplate);

  if (!foundReport) {
    const stops = await StopService.findAll({
      where: {
        job_id: job.id,
      },
      include: ['plan']
    });
    const vehicles = await VehicleService.findByJobId(job.id);

    const physicalFile = await (new ExportService).createMasterReport(job, stops, vehicles);
    const fileObj = await FileService.upload(currentUser.id, physicalFile, Enum.FILE_TEMPLATE.master_report);
    reportFile = await FileService.save(fileObj);

    if (!reportFile) {
      throw new ForbidenError('Save file error.');
    }

    await ExportService.save({
      user_id: currentUser.id,
      job_id: jobId,
      type: reportTemplate,
      file_id: reportFile.id,
      fleet_id: fleet.id
    });

  } else {
    reportFile = foundReport.file;
  }

  if (!reportFile) {
    throw new ForbidenError('Can not generate file.');
  }

  return FileService.createFileDownload(reportFile, res);
}
