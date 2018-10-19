import TaskModel from '../models/task.model';
import * as Enum from "../config/enum";
import {ValueError} from "../errors";
import database from "../config/database";
import * as VehicleService from "./vehicle.service";
import * as StopService from "./stop.service";
import * as PlanService from "./plan.service";
import _ from 'lodash';

/**
 * Find One
 *
 * @param options
 * @return {Promise<*|Promise<Model>>}
 */
export async function findOne(options) {
  return TaskModel.findOne(options);
}

/**
 * Find by id
 *
 * @param id
 * @param options
 * @return {Promise<*|Promise<Model>|{}>}
 */
export async function findById(id, options) {
  return TaskModel.findById(id, options);
}

/**
 * Update data
 *
 * @param id
 * @param data
 * @param transaction
 * @return {Promise<*>}
 */
export async function update(id, data, transaction) {
  let options = {
    where: {
      id: id
    }
  };

  if (transaction) {
    options.transaction = transaction;
  }

  return TaskModel.update(data, options);
}

/**
 * Create task
 *
 * @param data
 * @param options
 * @return {Promise<TaskModel>}
 */
export async function create(data, options) {
  return TaskModel.create(data, options);
}

/**
 * Init task
 *
 * @param jobId
 * @param commonRaw
 * @param stopsRaw
 * @param vehiclesRaw
 * @param authorizeUser
 * @param checkPointsRaw
 * @param jobType
 * @param action
 * @param transaction
 * @return {Promise<TaskModel>}
 */
export async function init(jobId, commonRaw, stopsRaw, vehiclesRaw,
                           authorizeUser, checkPointsRaw, jobType, action, transaction) {
  return create({
      job_id: jobId,
      common_raw: commonRaw,
      stops_raw: stopsRaw,
      vehicles_raw: vehiclesRaw,
      authorize_user: authorizeUser,
      check_points_raw: checkPointsRaw,
      type: jobType,
      action: action
    },
    {transaction: transaction}
  );
}

/**
 * Set status for task
 *
 * @param task
 * @param status
 * @param transaction
 * @return {Promise<void>}
 */
export async function setStatus(task, status, transaction) {
  const taskStatus = Enum.TASK_STATUS;

  if (Object.values(taskStatus).indexOf(status) === -1) {
    throw new ValueError(`${status} is not a valid task status`);
  }

  let rule = {};
  rule[taskStatus.init] = [taskStatus.running, taskStatus.partial_running, taskStatus.cancelled];
  rule[taskStatus.running] = [taskStatus.failed, taskStatus.success, taskStatus.cancelled];
  rule[taskStatus.partial_running] = [taskStatus.failed, taskStatus.success, taskStatus.cancelled];
  rule[taskStatus.failed] = [];
  rule[taskStatus.success] = [];

  let ableToChange = rule[task.status].indexOf(status) !== -1;
  if (!ableToChange) {
    throw new ValueError(`Cannot change task status from ${task.status} to ${status}`);
  }

  task.status = status;
  return transaction
    ? task.save({transaction: transaction})
    : task.save();
}

/**
 * Log error why task failed
 *
 * @param {TaskModel} task
 * @param error
 */
export async function logError(task, error) {
  const logTransaction = await database.transaction();

  /** @type {TaskModel} */
  task = await task.reload();
  await setStatus(task, Enum.TASK_STATUS.failed, logTransaction);
  task.trace_back = error.stack;
  await task.save({transaction: logTransaction});
  await logTransaction.commit();
}

/**
 *
 * @param jobId
 * @param planId
 * @param stopsRaw
 * @param transaction
 * @param replace
 * @return {Promise<{check_points: string, vehicle: VehicleModel, stops: StopModel[], split_points: Object}>}
 */
export async function splitPoints(jobId, planId, stopsRaw, transaction, replace) {
  let plan = await PlanService.findById(planId, {transaction: transaction});
  let checkPointSeq = await VehicleService.getCheckPointSeq(jobId, planId, stopsRaw, transaction);
  let editedVehicle = await VehicleService.getPartialVehicle(jobId, planId, checkPointSeq, transaction);
  let partialStops = await StopService.getPartialStops(jobId, planId, checkPointSeq, stopsRaw, transaction);
  let splitPoints = null;

  // find all subsequent plan
  let subsequentPlans = await PlanService
    .getSubsequentPlans(plan, transaction);

  let checkPoints = [{plan_id: plan.id, seq: checkPointSeq}];
  for (let plan of subsequentPlans) {
    checkPoints.push({plan_id: plan.id, seq: 0});
  }

  let middlePoint = createMiddlePoint(editedVehicle);
  if (subsequentPlans.length > 0) {
    let mergedData = await mergeSubsequentStops(plan.id, partialStops, middlePoint,
      subsequentPlans, transaction, replace);

    partialStops = mergedData.stops;
    splitPoints = mergedData.split_points;
  }

  return {
    check_points: checkPoints,
    vehicle: editedVehicle,
    stops: partialStops,
    split_points: splitPoints
  }
}

/**
 *
 * @param {String} priorPlanId
 * @param {StopModel[]} partialPriorStops
 * @param {{client_stop_id: *, lat: *, lng: *}} middlePoint
 * @param {PlanModel[]} subsequentPlans
 * @param transaction
 * @param replace
 * @return {{split_points: {plan_id: number, from: number, to: number}, stops: Promise<StopModel[]>}}
 */
async function mergeSubsequentStops(priorPlanId, partialPriorStops, middlePoint,
                                    subsequentPlans, transaction, replace=null) {

  let mergedStops = [...partialPriorStops];

  if (mergedStops.length > 0) {
    let middlePointClone = _.clone(middlePoint);
    middlePointClone.seq = mergedStops.length + 1;
    mergedStops.push(middlePointClone);
  }

  let splitPoints = [{plan_id: priorPlanId, from: 0, to: mergedStops.length}];

  for (let index in subsequentPlans) {
    let subsequentPlan = subsequentPlans[index];
    let baseSeq = mergedStops.length;

    let stops = replace !== null && subsequentPlan.id === replace.plan_id
      ? replace.stops
      : await StopService.findByPlanId(subsequentPlan.id, transaction);

    for (let stop of stops) {
      stop.seq = baseSeq + stop.seq;
      stop.client_vehicle_id = priorPlanId;

      mergedStops.push(stop);
    }

    if (parseInt(index) < subsequentPlans.length - 1) {
      let middlePointClone = _.clone(middlePoint);
      middlePointClone.seq = mergedStops.length + 1;
      mergedStops.push(middlePointClone);

      splitPoints.push({plan_id: subsequentPlan.id, from: baseSeq, to: mergedStops.length});
    } else {
      splitPoints.push({plan_id: subsequentPlan.id, from: baseSeq, to: mergedStops.length + 1});
    }
  }

  if (mergedStops[mergedStops.length - 1].client_stop_id === priorPlanId) {
    mergedStops.pop();
  }

  return {
    split_points: splitPoints,
    stops: mergedStops
  };
}

/**
 *  Create middle point
 *
 * @param {VehicleModel} vehicle
 * @return {{client_stop_id: *, lat: *, lng: *}}
 */
function createMiddlePoint(vehicle) {
  // Mimic real stop
  let middlePoint = StopService.createFakeStop();
  middlePoint.client_stop_id = vehicle.client_vehicle_id;
  middlePoint.client_vehicle_id = vehicle.client_vehicle_id;
  middlePoint.lat = vehicle.lat_end;
  middlePoint.lng = vehicle.lng_end;

  return middlePoint;
}

/**
 *
 * @param jobId
 * @param planId
 * @param stopsRaw
 * @param transaction
 * @param checkPointSeq
 * @return {Promise<{check_points: {plan_id: *, seq: *}[], vehicle: VehicleModel, stops: StopModel[], finish_time_adjust: String}>}
 */
export async function timeAdjust(jobId, planId, stopsRaw, transaction, checkPointSeq=null) {
  checkPointSeq = checkPointSeq != null
    ? checkPointSeq
    : await VehicleService.getCheckPointSeq(jobId, planId, stopsRaw, transaction);

  let editedVehicle = await VehicleService.getPartialVehicle(jobId, planId, checkPointSeq, transaction);
  let partialStops = await StopService.getPartialStops(jobId, planId, checkPointSeq, stopsRaw, transaction);

  let checkPoints = [{plan_id: planId, seq: checkPointSeq}];

  return {
    check_points: checkPoints,
    vehicle: editedVehicle,
    stops: partialStops,
    finish_time_adjust: planId.toString()
  }
}