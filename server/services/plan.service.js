import PlanModel from '../models/plan.model';
import {LogicError} from "../errors";
import * as VehicleService from '../services/vehicle.service';
import Sequelize from 'sequelize';
import _ from 'lodash';


/**
 *
 * @param id
 * @param options
 * @returns {Promise<PlanModel>}
 */
export async function findById(id, options) {
  return PlanModel.findById(id, options);
}

/**
 *
 * @param options
 * @return {Promise<PlanModel[]>}
 */
export async function findAll(options) {
  return PlanModel.findAll(options);
}

/**
 *
 * @param fleetId
 * @param transaction
 * @return {Promise<PlanModel[]>}
 */
export async function findAllByFleetId(fleetId, transaction) {
  let options = {
    where: {
      fleet_id: fleetId
    }
  };

  if (transaction) {
    options.transaction = transaction;
  }

  return PlanModel.findAll(options);
}

/**
 *
 * @param {int} firstPlanId
 * @param {int} secondPlanId
 * @param transaction
 * @return {Promise<boolean>}
 */
export async function isSameClientVehicle(firstPlanId, secondPlanId, transaction) {
  const Op = Sequelize.Op;

  /** @type PlanModel[] */
  let plans = await PlanModel.findAll({
    where: {
      id: {
        [Op.in]: [firstPlanId, secondPlanId]
      }
    },
    transaction: transaction
  });

  if (plans.length !== 2) {
    throw new Error('Invalid plan ids');
  }

  return plans[0].client_vehicle_id === plans[1].client_vehicle_id;
}

/**
 * Update plan
 *
 * @param id
 * @param data
 * @returns {Promise<void>}
 */
export async function update(id, data) {
  return PlanModel
    .update(data, {
      where: {id: id}
    });
}

/**
 * Save plan to DB
 *
 * @param options
 * @param data
 * @returns {Promise<*>}
 */
export async function save(data, options) {
  return PlanModel.create(data, options);
}

/**
 * Save multiple records at a time
 *
 * @param data
 * @returns {Promise<Array<Model>>}
 */
export async function bulkSave(data) {
  return PlanModel.bulkCreate(data);
}

/**
 * Re-calculate all fields such as time_start, time_end...
 *
 * @param plan
 * @param timeStart
 * @param mergedLegs
 * @param jobId
 * @param transaction
 * @return {Promise<void>}
 */
export async function reCaculateProps(plan, timeStart, mergedLegs, jobId, transaction) {
  let sortedLegs = mergedLegs.sort( (a, b) => a.seq - b.seq );

  if (sortedLegs.length === 0) {
    throw LogicError('Plan have no legs');
  }

  let lastLeg = sortedLegs[sortedLegs.length - 1];
  let vehicle = await VehicleService.findByJobIdAndClientVehicleId(jobId, plan.client_vehicle_id, transaction);

  // plan.time_start = `${job.date_depart} ${vehicle.time_start}`;
  plan.time_start = timeStart;
  plan.time_end = lastLeg.finish_time;
  plan.num_of_route = sortedLegs.length;
  plan.total_wait_time = _.sumBy(sortedLegs, 'wait_time');
  plan.total_eta = _.sumBy(sortedLegs, 'eta');
  plan.total_time = plan.total_eta + plan.total_wait_time;
  plan.total_distance = _.sumBy(sortedLegs, 'distance');
  plan.total_service_time = _.sumBy(sortedLegs, 'service_time');
  plan.total_toll_fee = _.sumBy(sortedLegs, 'toll_fee');
  plan.total_volume = _.sumBy(sortedLegs, 'volume');
  plan.total_weight = _.sumBy(sortedLegs, 'weight');
  plan.percentage_volume = Math.round(plan.total_volume / vehicle.volume * 100);
  plan.percentage_weight = Math.round(plan.total_weight / vehicle.weight * 100);

  return transaction ? plan.save({transaction: transaction}) : plan.save();
}


export async function getSubsequentPlans(plan, transaction, isLeg=false) {
  const Op = Sequelize.Op;

  let where = {
    client_vehicle_id: plan.client_vehicle_id,
    fleet_id: plan.fleet_id,
    time_start: {
      [Op.gt]: plan.time_start
    }
  };

  let options = {where: where, order: [['id', 'asc']]};
  if (isLeg) {
    options.include = ['legs'];
  }
  if (transaction) {
    options.transaction = transaction;
  }

  return findAll(options);
}

/**
 * Create place holder plan, basically is empty plan
 *
 * @param fleetId
 * @param clientVehicleId
 * @param vehicleId
 * @param transaction
 */
export function createPlaceHolderPlan(fleetId, clientVehicleId, vehicleId, transaction) {
  let data = {
    fleet_id: fleetId,
    client_vehicle_id: clientVehicleId,
    vehicle_id: vehicleId,
    is_draft: 1
  };

  return transaction
    ? save(data, {transaction: transaction})
    : save(data);
}