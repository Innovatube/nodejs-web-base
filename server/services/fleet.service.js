import FleetModel from '../models/fleet.model';
import PlanModel from "../models/plan.model";
import LegModel from "../models/leg.model";
import {LogicError} from "../errors";
import _ from 'lodash';


/**
 *
 * @param id
 * @param options
 * @returns {Promise<*|Model>}
 */
export async function findById(id, options) {
  return await FleetModel.findById(id, options);
}

/**
 * Update fleet
 *
 * @param data
 * @param options
 * @returns {Promise<void>}
 */
export async function update(data, options) {
  return await FleetModel
    .update(data, options);
}

/**
 * Save fleet to DB
 *
 * @param {object} options
 * @param {object} data
 * @returns {Promise<*>}
 */
export async function save(data, options) {
  return await FleetModel.create(data, options)
}


/**
 * Find One
 *
 * @param options
 * @returns {Promise<*|Model>}
 */
export async function findOne(options) {
  return await FleetModel.findOne(options);
}

/**
 *
 * @param options
 * @returns {Promise<FleetModel[]>}
 */
export async function findAll(options) {
  return await FleetModel.findAll(options);
}

/**
 * Find all fleet by job id
 *
 * @param jobId
 * @param {*[]|null} include
 * @return {Promise<FleetModel[]>}
 */
export async function findAllByJobId(jobId, include=null) {
  let options = {
    where: {
      job_id: jobId
    }
  };

  if (include) {
    options.include = include;
  }

  return findAll(options);
}

/**
 * Get fleet and its association, include plans and legs
 *
 * @param {number} id: fleet id
 * @param transaction
 * @returns {Promise<*|Model>}
 */
export async function getFullById(id, transaction) {
  let options = {
    include: {model: PlanModel, include: {model: LegModel}}
  };

  if (transaction) {
    options.transaction = transaction;
  }

  return await FleetModel.findById(id, options);
}

/**
 * Recalculate fleet props
 *
 * @param fleet
 * @param plans
 * @param transaction
 * @return {Promise<this|Errors.ValidationError>}
 */
export async function recalculateProps(fleet, plans, transaction) {
  if (plans.length === 0) {
    throw new LogicError('Plans is empty');
  }

  fleet.total_wait_time = _.sumBy(plans, 'total_wait_time');
  fleet.total_eta = _.sumBy(plans, 'total_eta');
  fleet.total_time = _.sumBy(plans, 'total_time');
  fleet.total_distance = _.sumBy(plans, 'total_distance');
  fleet.total_service_time = _.sumBy(plans, 'total_service_time');
  fleet.total_toll_fee = _.sumBy(plans, 'total_toll_fee');
  fleet.total_volume = _.sumBy(plans, 'total_volume');
  fleet.total_weight = _.sumBy(plans, 'total_weight');

  return transaction ? fleet.save({transaction: transaction}) : fleet.save();
}