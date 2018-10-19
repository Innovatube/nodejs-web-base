import Sequelize from 'sequelize';
import JobModel from '../models/job.model';
import FleetModel from '../models/fleet.model';
import FileModel from '../models/file.model';
import * as Enum from '../config/enum';
import VehicleModel from '../models/vehicle.model';
import StopModel from '../models/stop.model';
import {ValueError} from '../errors';
const Op = Sequelize.Op;

/**
 * Get common by its ID
 *
 * @param {number} id
 * @param options
 * @returns {Promise<*|Model>}
 */
export async function findById(id, options) {
  return JobModel.findById(id, options);
}

/**
 * Count by fitter
 * @param {Object} req
 * @returns {Promise<*|Model>}
 */
export async function countByFitter(req) {
  return await JobModel.count({});
}

/**
 * Get current fleet of job
 *
 * @param jobId
 * @param transaction
 * @returns {Promise<FleetModel>}
 */
export async function getLastFleet(jobId, transaction) {
  let options = {
    where: {job_id: jobId},
    order: [['id', 'desc']]
  };

  if (transaction) {
    options.transaction = transaction;
  }
  return FleetModel.findOne(options);
}

/**
 * Find one
 *
 * @param options
 * @returns {Promise<*|Model>}
 */
export async function findOne(options) {
  const optionsFind = {
    ...options,
    include: [{model: FileModel}]
  };
  return JobModel.findOne(optionsFind);
}

/**
 * Find job that own by session user
 *
 * @param jobId
 * @param userId
 * @param transaction
 * @return {Promise<*|Promise<Model>>}
 */
export async function findOwnJob(jobId, userId, transaction) {
  let options = {
    where: {
      user_id: userId,
      id: jobId
    }
  };

  if (transaction) {
    options.transaction = transaction;
  }

  return JobModel.findOne(options);
}

/**
 * Save post body to database
 * 
 * @param {Object} data
 * @param options
 * @returns {Promise<*|Model>}
 */
export async function create(data, options) {
  return JobModel.create(data, options);
}

export async function update(data, options) {
  return JobModel.update(data, options)
}

/**
 * Check if job type is valid
 *
 * @param type
 * @return {Promise<void>}
 */
export async function isValidJobType(type) {
  return Object
    .values(Enum.JOB_TYPE)
    .indexOf(req.body.type) !== -1;
}

/**
 * Get job info and its related data
 *
 * @param jobId
 * @param userId
 * @param transaction
 * @return {Promise<*|Promise<Model>>}
 */
export async function getLogisticsJob(jobId, userId, transaction) {
  let options = {
    where: {
      user_id: userId,
      id: jobId
    },
    include: [{model: VehicleModel}, {model: StopModel}]
  };

  if (transaction) {
    options.transaction = transaction;
  }

  return JobModel.findOne(options);
}