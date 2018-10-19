import {BadRequest, LogicError, NotFound, StopSequenceNotChange, ValidationError, ValueError} from "../../errors";
import * as StopService from '../../services/stop.service';
import * as VehicleService from '../../services/vehicle.service';
import * as JobService from '../../services/job.service';
import * as PlanService from '../../services/plan.service';
import database from "../../config/database";
import * as Enum from '../../config/enum';
import LogisticsService from "../../services/logistics.service";
import * as TaskService from "../../services/task.service";
import moment from 'moment';
import * as Helper from "../../utils/helper";

/**
 * Move stop from other route
 *
 * @param req
 * @param res
 */
export async function moveServedToExistRoute(req, res) {
  let jobId = req.body.job_id;
  let moveData = req.body.move_data;
  let currentUser = req.currentUser;

  let firstStops = moveData[0].stops;
  let firstPlanId = moveData[0].plan_id;

  let secondStops = moveData[1].stops;
  let secondPlanId = moveData[1].plan_id;

  await database.transaction( async transaction => {
    let job = await JobService.findOwnJob(jobId, currentUser.id, transaction);

    if (!job) {
      throw new NotFound('Job not found');
    }

    let isValid = await StopService
      .ableToMoveStops(jobId, firstPlanId, firstStops, secondPlanId, secondStops, transaction);

    if (!isValid) {
      throw new BadRequest('move data is invalid, cannot move');
    }

    let task;
    const isSameClientVehicle = await PlanService.isSameClientVehicle(firstPlanId, secondPlanId);
    if (isSameClientVehicle) {
      task = await createSameVehicleMoveTask(
        job,
        currentUser.email,
        firstPlanId,
        firstStops,
        secondPlanId,
        secondStops,
        transaction
      );
    } else {
      task = await createCommonMoveTask(
        job,
        currentUser.email,
        firstPlanId,
        firstStops,
        secondPlanId,
        secondStops,
        transaction
      )
    }

    // Send to logistics API data that changed
    await LogisticsService.partialEditRoutes(task, transaction);

    return res.json({
      error: false,
      data: {task_id: task.id}
    })
  });
}

/**
 * Create task for move stops between two plan from diffrent vehicle
 *
 * @param {JobModel} job
 * @param email
 * @param {int} firstPlanId
 * @param {StopModel[]} firstStopsRaw
 * @param {int} secondPlanId
 * @param {StopModel[]} secondStopsRaw
 * @param transaction
 * @return {Promise<TaskModel>}
 */
async function createCommonMoveTask(job, email, firstPlanId, firstStopsRaw, secondPlanId, secondStopsRaw, transaction) {
  let {firstData, secondData} = await
    getCommonMoveTaskData(job, firstPlanId, firstStopsRaw, secondPlanId, secondStopsRaw, transaction);

  let checkPoints = [];
  let splitPoints = {};
  let stops = [];
  let vehicles = [];

  // analyze first data
  if (firstData) {
    if (firstData.check_points) {
      checkPoints = [...checkPoints, ...firstData.check_points];
    }

    if (firstData.split_points) {
      splitPoints[firstPlanId] = firstData.split_points;
    }

    stops = [...stops, ...firstData.stops];
    vehicles = [...vehicles, firstData.vehicle];
  }

  // analyze second data
  if (secondData) {
    if (secondData.check_points) {
      checkPoints = [...checkPoints, ...secondData.check_points];
    }

    if (secondData.split_points) {
      splitPoints[secondPlanId] = secondData.split_points;
    }

    stops = [...stops, ...secondData.stops];
    vehicles = [...vehicles, secondData.vehicle];
  }

  return TaskService.create({
      job_id: job.id,
      common_raw: JSON.stringify(job.toJSON()),
      stops_raw:  JSON.stringify(stops),
      vehicles_raw: JSON.stringify(vehicles),
      authorize_user: email,
      check_points_raw: checkPoints.map(cp => `${cp.plan_id}|${cp.seq}`).join(),
      split_points_raw:  JSON.stringify(splitPoints),
      type:  Enum.JOB_TYPE.master,
      action: Enum.ACTION.move_served_to_exist_route,
    },
    {transaction: transaction}
  )
}

/**
 *
 * @param {JobModel} job
 * @param {int} firstPlanId
 * @param {[]} firstStopsRaw
 * @param {int} secondPlanId
 * @param {[]} secondStopsRaw
 * @param transaction
 * @return {Promise<{}>}
 */
async function getCommonMoveTaskData(job, firstPlanId, firstStopsRaw, secondPlanId, secondStopsRaw, transaction) {
  let firstData;
  let secondData;

  let isFirstSeqChange = true;
  try {
    firstData = await TaskService.splitPoints(job.id, firstPlanId, firstStopsRaw, transaction);
  } catch (e) {
    if (e.className === 'StopSequenceNotChange') {
      isFirstSeqChange = false;

    } else {
      throw e;
    }
  }

  let isSecondSeqChange = true;
  try {
    secondData = await TaskService.splitPoints(job.id, secondPlanId, secondStopsRaw, transaction);
  } catch (e) {
    if (e.className === 'StopSequenceNotChange') {
      isSecondSeqChange = false;

    } else {
      throw e;
    }
  }

  const isBothSeqNotChange = !isFirstSeqChange && !isSecondSeqChange;
  if (isBothSeqNotChange) {
    throw new StopSequenceNotChange('Both stop sequences do not change');
  }

  return {firstData, secondData};
}

/**
 * Create task move stops bewteen 2 plan of same vehicle
 *
 * @param {JobModel} job
 * @param email
 * @param {int} firstPlanId
 * @param {StopModel[]} firstStops
 * @param {int} secondPlanId
 * @param {StopModel[]} secondStops
 * @param transaction
 * @return {Promise<TaskModel>}
 */
async function createSameVehicleMoveTask(job, email, firstPlanId, firstStops, secondPlanId, secondStops, transaction) {
  let firstPlan = await PlanService.findById(firstPlanId, {transaction: transaction});
  let secondPlan = await PlanService.findById(secondPlanId, {transaction: transaction});

  let priorPlan;
  let subsequentPlan;
  let priorStopsRaw;
  let subsequentStopsRaw;

  if (moment(firstPlan.time_start).isBefore(secondPlan.time_start)) {
    priorPlan = firstPlan;
    subsequentPlan = secondPlan;
    priorStopsRaw = firstStops;
    subsequentStopsRaw = secondStops;

  } else {
    priorPlan = secondPlan;
    subsequentPlan = firstPlan;
    priorStopsRaw = secondStops;
    subsequentStopsRaw = firstStops;
  }

  let subsequentStops = await StopService.getPartialStops(job.id, priorPlan.id, 0, subsequentStopsRaw, transaction);
  let replace = {
    plan_id: subsequentPlan.id,
    stops: subsequentStops
  };

  let taskData = await TaskService.splitPoints(job.id, priorPlan.id, priorStopsRaw, transaction, replace);

  const checkPointsRaw = taskData
    .check_points.map(cp => `${cp.plan_id}|${cp.seq}`)
    .join();

  let splitPoints = {};
  splitPoints[priorPlan.id] = taskData.split_points;

  return TaskService.create({
      job_id: job.id,
      common_raw: JSON.stringify(job.toJSON()),
      stops_raw:JSON.stringify(taskData.stops),
      vehicles_raw: JSON.stringify([taskData.vehicle]),
      authorize_user: email,
      check_points_raw: checkPointsRaw,
      split_points_raw: JSON.stringify(splitPoints),
      type:  Enum.JOB_TYPE.master,
      action: Enum.ACTION.move_served_to_exist_route,
    },
    {transaction: transaction}
  )
}

/**
 * Re sequence of stops
 * 1. Change seq of stops in on route
 * 2. Save un-change point of stops
 *
 *  req.body = {
 *    job_id: int,
 *    client_vehicle_id: str
 *    stops: [
 *      {seq: int, client_stop_id: str},
		    {seq: int, client_stop_id: str}
 *    ]
 *  }
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function changeSequence(req, res) {
  let jobId = req.body.job_id;
  let stopRaw = req.body.stops;
  let planId = req.body.plan_id;
  let currentUser = req.currentUser;

  await database.transaction( async transaction => {
    let job = await JobService.findOwnJob(jobId, currentUser.id, transaction);

    if (!job) {
      throw new NotFound('Job not found');
    }

    let taskData = await TaskService.splitPoints(job.id, planId, stopRaw, transaction);
    const checkPointsRaw = taskData
      .check_points.map(cp => `${cp.plan_id}|${cp.seq}`)
      .join();

    let splitPoints;
    if (taskData.split_points) {
       splitPoints = {};
      splitPoints[planId] = taskData.split_points;
    }

    let task = await TaskService.create({
        job_id: job.id,
        common_raw: JSON.stringify(job.toJSON()),
        stops_raw:JSON.stringify(taskData.stops),
        vehicles_raw: JSON.stringify([taskData.vehicle]),
        authorize_user: currentUser.email,
        check_points_raw: checkPointsRaw,
        split_points_raw: splitPoints ? JSON.stringify(splitPoints) : null,
        type:  Enum.JOB_TYPE.master,
        action: Enum.ACTION.change_sequence,
      },
      {transaction: transaction}
    );

    // Send to logistics API data that changed
    await LogisticsService.partialEditRoutes(task, transaction);

    return res.json({
      error: false,
      data: {task_id: task.id}
    });
  });
}

/**
 * Reset stop sequence to default
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */
export async function resetSequence(req, res) {
  let jobId = req.body.job_id;
  let planId = req.body.plan_id;
  let currentUser = req.currentUser;

  await database.transaction( async transaction => {
    let job = await JobService.findOwnJob(jobId, currentUser.id, transaction);

    if (!job) {
      throw new NotFound('Job not found');
    }

    let stops = await StopService.findByPlanId(planId, transaction);
    const checkPointSeq = 0;

    let taskData = await TaskService.timeAdjust(jobId, planId, stops, transaction, checkPointSeq);
    const checkPointsRaw = taskData
      .check_points.map(cp => `${cp.plan_id}|${cp.seq}`)
      .join();

    // TODO do this only temporally, must remove after
    taskData.vehicle.reverse_delivery = 0;

    // Create task
    let task = await TaskService.create({
        job_id: job.id,
        common_raw: JSON.stringify(job.toJSON()),
        stops_raw:JSON.stringify(taskData.stops),
        vehicles_raw: JSON.stringify([taskData.vehicle]),
        authorize_user: currentUser.email,
        check_points_raw: checkPointsRaw,
        finish_time_adjust_raw: taskData.finish_time_adjust,
        type:  Enum.JOB_TYPE.general,
        action: Enum.ACTION.reset_sequence,
      },
      {transaction: transaction}
    );

    // Send to logistics API data that changed
    await LogisticsService.partialEditRoutes(task, transaction);

    return res.json({
      error: false,
      data: {task_id: task.id}
    });
  });
}

/**
 * Move unserved stops to existing route
 *
 * @return {Promise<void>}
 */
export async function moveUnServedToExistRoute(req, res) {
  let body = req.body;
  let unservedStops = body.unserved;
  let jobId = body.job_id;
  let planId = body.plan_id;
  let stopsRaw = body.stops;
  let currentUser = req.currentUser;

  await database.transaction( async transaction => {
    let job = await JobService.findOwnJob(jobId, currentUser.id, transaction);
    if (!job) {
      throw new NotFound('Job not found');
    }

    const isUnserved = await StopService.isUnserved(jobId, unservedStops, transaction);
    if (!isUnserved) {
      throw new ValueError('Stops is not unserved');
    }

    let taskData = await TaskService.timeAdjust(jobId, planId, stopsRaw, transaction);
    const checkPointsRaw = taskData
      .check_points.map(cp => `${cp.plan_id}|${cp.seq}`)
      .join();

    // Create task
    let task = await TaskService.create({
        job_id: job.id,
        common_raw: JSON.stringify(job.toJSON()),
        stops_raw:JSON.stringify(taskData.stops),
        vehicles_raw: JSON.stringify([taskData.vehicle]),
        authorize_user: currentUser.email,
        check_points_raw: checkPointsRaw,
        finish_time_adjust_raw: taskData.finish_time_adjust,
        type:  Enum.JOB_TYPE.master,
        action: Enum.ACTION.move_unserved_to_exist_route,
      },
      {transaction: transaction}
    );

    await LogisticsService.partialEditRoutes(task, transaction);

    return res.json({
      error: false,
      data: {task_id: task.id}
    });
  });
}

/**
 * API create vehicles
 *
 * @param req
 * @param res
 * @return {Promise<*>}
 */
export async function moveUnServedToNewRoute(req, res) {
  let body = req.body;
  let jobId = body.job_id;
  let stops = body.stops;
  let vehicle = body.vehicle;
  let currentUser = req.currentUser;

  await database.transaction(async transaction => {
    let job = await JobService.findOwnJob(jobId, currentUser.id, transaction);
    if (!job) {
      throw new NotFound('Job is not found');
    }

    let inUnServed = await StopService
      .isUnserved(jobId, stops.map(stop => stop.client_stop_id), transaction);

    if (!inUnServed) {
      throw new BadRequest('stops is not unserved');
    }

    const existsVehicle = await VehicleService
      .findByJobIdAndClientVehicleId(jobId, vehicle.client_vehicle_id);

    if (existsVehicle) {
      throw new LogicError(`Vehicle with ID ${vehicle.client_vehicle_id} is already exists`);
    }

    let preparedVehicle = prepareCreateVehicle(job.id, vehicle);

    /**  @type VehicleModel */
    let savedVehicle = await VehicleService.save(preparedVehicle, {transaction: transaction});

    // create placeholder plan
    const fleet = await JobService.getLastFleet(jobId, transaction);
    let savedPlan = await PlanService.createPlaceHolderPlan(fleet.id, vehicle.client_vehicle_id, vehicle.id);

    // load full properties
    let foundVehicle = await VehicleService.findById(savedVehicle.id, {transaction: transaction});
    // change its name
    foundVehicle = foundVehicle.toJSON();
    foundVehicle.client_vehicle_id = savedPlan.id;

    let common = job.toJSON();
    let unServedStops = await StopService.findInStopClientIds(
      job.id,
      stops.map(stop => stop.client_stop_id),
      transaction
    );

    // save logistics request
    let task = await TaskService.init(
      job.id,
      JSON.stringify(common),
      JSON.stringify(unServedStops),
      JSON.stringify([foundVehicle]),
      currentUser.email,
      `${savedPlan.id}|0`,
      Enum.JOB_TYPE.general,
      Enum.ACTION.move_unserved_to_new_route,
      transaction
    );

    await LogisticsService.partialEditRoutes(task, transaction);

    return res.json({
      error: false,
      data: {task_id: task.id}
    })
  });
}

/**
 * Move served stops to new route
 *
 * @return {Promise<void>}
 */
export async function moveServedToNewRoute(req, res) {
  let body = req.body;
  let jobId = body.job_id;
  let moveData = body.move_data;

  let firstStops = moveData[0].stops;
  let firstPlanId = moveData[0].plan_id;

  let secondStops = moveData[1].stops;
  let vehicle = moveData[1].vehicle;

  let currentUser = req.currentUser;

  await database.transaction(async transaction => {
    let job = await JobService.findOwnJob(jobId, currentUser.id, transaction);
    if (!job) {
      throw new NotFound('Job is not found');
    }

    const existedVehicle = await VehicleService
      .findByJobIdAndClientVehicleId(jobId, vehicle.client_vehicle_id, transaction);

    if (existedVehicle) {
      throw new LogicError(`Vehicle with ID ${vehicle.client_vehicle_id} is already exists`);
    }

    let preparedVehicle = prepareCreateVehicle(jobId, vehicle);

    /**  @type VehicleModel */
    let savedVehicle = await VehicleService.save(preparedVehicle, {transaction: transaction});

    // create placeholder plan
    const fleet = await JobService.getLastFleet(jobId, transaction);
    let placeholderPlan = await PlanService
      .createPlaceHolderPlan(fleet.id, savedVehicle.client_vehicle_id, savedVehicle.id, transaction);

    let firstTaskData = await TaskService.splitPoints(job.id, firstPlanId, firstStops, transaction);
    let secondTaskData = await TaskService.splitPoints(job.id, placeholderPlan.id, secondStops, transaction);

    const checkPointsRaw = [...firstTaskData.check_points, ...secondTaskData.check_points]
      .map(cp => `${cp.plan_id}|${cp.seq}`)
      .join();

    const stops = [...firstTaskData.stops, ...secondTaskData.stops];
    const vehicles = [firstTaskData.vehicle, secondTaskData.vehicle];

    let splitPoints = {};
    if (firstTaskData.split_points) {
      splitPoints[firstPlanId] = firstTaskData.split_points;
    }

    let task = await TaskService.create({
      job_id: job.id,
      common_raw: JSON.stringify(job.toJSON()),
      stops_raw:JSON.stringify(stops),
      vehicles_raw: JSON.stringify(vehicles),
      authorize_user: currentUser.email,
      check_points_raw: checkPointsRaw,
      split_points_raw: JSON.stringify(splitPoints),
      type:  Enum.JOB_TYPE.master,
      action: Enum.ACTION.move_served_to_new_route,
    },
    {transaction: transaction});

    await LogisticsService.partialEditRoutes(task, transaction);

    return res.json({
      error: false,
      data: {task_id: task.id}
    })
  });
}

/**
 * Prepare vehicle object from request
 *
 * @param {Number} jobId
 * @param {Object} vehicleRaw
 */
function prepareCreateVehicle(jobId, vehicleRaw) {
  let preparedVehicle = {
    job_id: jobId,
    client_vehicle_id: vehicleRaw.client_vehicle_id,
    lat_start: parseFloat(vehicleRaw.lat_start),
    lng_start: parseFloat(vehicleRaw.lng_start)
  };

  Helper.assign(preparedVehicle, 'lat_end', Helper.parseFloat, false, vehicleRaw.lat_end);
  Helper.assign(preparedVehicle, 'lng_end', Helper.parseFloat, false, vehicleRaw.lng_end);
  Helper.assign(preparedVehicle, 'time_start', Helper.parseTime, false, vehicleRaw.time_start);
  Helper.assign(preparedVehicle, 'time_end', Helper.parseTime, false, vehicleRaw.time_end);
  Helper.assign(preparedVehicle, 'speed_limit', Helper.parseInt, false, vehicleRaw.speed_limit);
  Helper.assign(preparedVehicle, 'break_time_start', Helper.parseTime, false, vehicleRaw.break_time_start);
  Helper.assign(preparedVehicle, 'break_time_end', Helper.parseTime, false, vehicleRaw.break_time_end);
  Helper.assign(preparedVehicle, 'volume', Helper.parseFloat, false, vehicleRaw.volume);
  Helper.assign(preparedVehicle, 'weight', Helper.parseFloat, false, vehicleRaw.weight);
  Helper.assign(preparedVehicle, 'type', Helper.parseEnum, false, vehicleRaw.type, Object.values(Enum.VEHICLE_TYPE));
  Helper.assign(preparedVehicle, 'priority', Helper.parseEnum, false, vehicleRaw.priority, Object.values(Enum.PRIORITY));
  Helper.assign(preparedVehicle, 'time_to_leave', Helper.parseInt, false, vehicleRaw.time_to_leave);
  Helper.assign(preparedVehicle, 'reverse_delivery', Helper.parseInt, false, vehicleRaw.reverse_delivery);

  return preparedVehicle;
}


/**
 * List stops
 *
 * @param req
 * @param res
 */
export async function list(req, res) {
  let jobId = req.query.job_id;

  if (!jobId) {
    throw new ValidationError('String query job_id is required', {
      job_id: ['job_id is required']
    });
  }

  let job = await JobService.findOwnJob(jobId, req.currentUser.id);

  if (!job) {
    throw new NotFound('Job is not found');
  }

  let stops = await StopService.findByJobId(jobId);

  return res.json({
    error: false,
    data: {stops: stops}
  })
}