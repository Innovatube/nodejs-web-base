import StopModel from '../models/stop.model';
import * as Enum from '../config/enum';
import util from "util";
import _ from "lodash";
import logger from "../config/winston";
import Sequelize from 'sequelize';
import {BadRequest, LogicError, ValueError} from "../errors";
import * as Helper from '../utils/helper';
import moment from "moment";
import * as JobService from '../services/job.service';
import * as FleetService from '../services/fleet.service';
import * as PlanService from '../services/plan.service';


export async function findAll(options) {
  return StopModel.findAll(options);
}

/**
 *
 * @param jobId
 * @param {Array} stopClientIds
 * @param transaction
 * @return {Promise<StopModel[]>}
 */
export async function findInStopClientIds(jobId, stopClientIds, transaction) {
  const Op = Sequelize.Op;
  let options = {
    where: {
      client_stop_id: {
        [Op.in]: stopClientIds,
      },
      job_id: jobId
    }
  };

  if (transaction) {
    options.transaction = transaction;
  }

  return StopModel.findAll(options);
}

/**
 * Find stop by job id
 *
 * @param {number} jobId
 * @param transaction
 * @returns {Promise<*>}
 */
export async function findByJobId(jobId, transaction) {
  let options = {
    where: {
      job_id: jobId
    }
  };

  if (transaction) {
    options.transaction = transaction;
  }

  return StopModel.findAll(options);
}

/**
 * Find by plan id
 *
 * @param planId
 * @param transaction
 * @return {Promise<*|Promise<Model>>}
 */
export async function findByPlanId(planId, transaction) {
  let options = {
    where: {
      plan_id: planId
    }
  };

  if (transaction) {
    options.transaction = transaction;
  }

  return StopModel.findAll(options);
}

/**
 *
 * @param planIds
 * @param transaction
 * @return {Promise<StopModel[]>}
 */
export async function findInPlanIds(planIds, transaction) {
  const Op = Sequelize.Op;
  let options = {
    where: {
      plan_id: {
        [Op.in]: planIds
      }
    }
  };

  if (transaction) {
    options.transaction = transaction;
  }

  return StopModel.findAll(options);
}

/**
 * Update stop
 *
 * @param data
 * @param options
 * @returns {Promise<void>}
 */
export async function update (data, options) {
  return StopModel
    .update(data, options);
}

/**
 * Delete where by object
 *
 * @param where
 * @returns {Promise<*|Model>}
 */
exports.deleteWhere = async function (where) {
  return StopModel.destroy({
    where: where
  });
};

export function parseSheet(dataExcel, templateType) {
  const stopSheets = dataExcel.sheet('stops');
  if (!stopSheets) {
    throw new LogicError('Cannot read sheet stops');
  }

  let stops = [];
  stopSheets.forEachExistingRow(row => {
    // row 1 is instructions, ignore
    // row 2 is header
    if (row.rowNumber() === 2) {
      parseHeader(row, templateType);

    } else if (row.rowNumber() > 2) {
      let stop = parseRow(row, templateType);
      if (stop) {
        stops.push(stop);
      }
    }
  });

  return stops;
}

function parseHeader(row, templateType) {
  let isCommon = row.cell('A').value() === 'stop_id' &&
    row.cell('B').value() === 'lat' &&
    row.cell('C').value() === 'lng' &&
    row.cell('D').value() === 'service_time' &&
    row.cell('E').value() === 'time_st' &&
    row.cell('F').value() === 'time_en' &&
    row.cell('G').value() === 'volume' &&
    row.cell('H').value() === 'weight' &&
    row.cell('I').value() === 'dropoffs' &&
    row.cell('J').value() === 'type';

  let isGeneral = isCommon &&
    row.cell('K').value() === 'priority' &&
    row.cell('L').value() === 'zone';

  let isMaster = isCommon &&
    row.cell('K').value() === 'seq' &&
    row.cell('L').value() === 'vehicle_id';

  if (templateType === Enum.JOB_TYPE.general && !isGeneral) {
    throw new ValueError('Excel file is not general template, check stops sheet')
  }

  if (templateType === Enum.JOB_TYPE.master && !isMaster) {
    throw new ValueError('Excel file is not master template, check stops sheet')
  }
}

/**
 * Parse excel to database
 *
 * @param {Object} dataExcel
 * @param jobId
 * @param templateType
 * @param transaction
 * @returns {Object}
 */
export async function parseAndSaveToDB(dataExcel, jobId, templateType, transaction) {
  let parsedStops = parseSheet(dataExcel, templateType);
  parsedStops = parsedStops.map( stop => {
    stop.job_id = jobId;
    return stop;
  });

  return StopModel.bulkCreate(parsedStops, {transaction: transaction});
}

/**
 *  Parse fields that both general and master have same cell
 *
 * @param row
 * @return object
 */
function parseCommonFields(row) {
  let obj = {};

  let clientStopId = row.cell('A').value();
  Helper.assign(obj, 'client_stop_id', null, true, clientStopId);

  let lat = row.cell('B').value();
  Helper.assign(obj, 'lat', Helper.parseFloat, true, lat);

  let lng = row.cell('C').value();
  Helper.assign(obj, 'lng', Helper.parseFloat, true, lng);

  let serviceTime = row.cell('D').value();
  Helper.assign(obj, 'service_time', Helper.parseInt, false, serviceTime);

  let timeStart = row.cell('E').value();
  Helper.assign(obj, 'time_start', Helper.parseTime, false, timeStart, 'HH:mm:ss', 'HH:mm:ss');

  let timeEnd = row.cell('F').value();
  try {
    Helper.assign(obj, 'time_end', Helper.parseTime, false, timeEnd, 'HH:mm:ss', 'HH:mm:ss');
  } catch (e) {
    timeEnd = moment(timeStart, 'HH:mm:ss').minutes(parseInt(timeEnd) * 60);
    Helper.assign(obj, 'time_end', Helper.parseTime, false, timeEnd, 'HH:mm:ss', 'HH:mm:ss');
  }

  let volume = row.cell('G').value();
  Helper.assign(obj, 'volume', Helper.parseFloat, false, volume);

  let weight = row.cell('H').value();
  Helper.assign(obj, 'weight', Helper.parseFloat, false, weight);

  let dropoffs = row.cell('I').value();
  Helper.assign(obj, 'dropoffs', Helper.parseEnum, false, dropoffs, Object.values(Enum.DROPOFFS));

  // type of stop can be sent with value: 2|4
  let type = row.cell('J').value();
  if (type) {
    let splitType = type.toString().split('|').map( type => Number.parseInt(type));
    for (let type of splitType) {
      Helper.parseEnum(type, Object.values(Enum.VEHICLE_TYPE));
    }

    Helper.assign(obj, 'type', null, false, type);
  }

  return obj;
}

/**
 * Parse master row
 *
 * @param row
 */
function parseMasterRow(row) {
  let obj = parseCommonFields(row);

  let seq = row.cell('K').value();
  Helper.assign(obj, 'initial_seq', Helper.parseInt, false, seq);
  Helper.assign(obj, 'seq', Helper.parseInt, false, seq);

  let clientVehicleId = row.cell('L').value();
  Helper.assign(obj, 'initial_client_vehicle_id', null, false, clientVehicleId);
  Helper.assign(obj, 'client_vehicle_id', null, false, clientVehicleId);

  let name = row.cell('M').value();
  Helper.assign(obj, 'name', null, false, name);

  let address = row.cell('N').value();
  Helper.assign(obj, 'address', null, false, address);

  let tel = row.cell('O').value();
  Helper.assign(obj, 'tel', null, false, tel);

  return obj;
}

/**
 * Parse general row
 *
 * @param row
 */
function parseGeneralRow(row) {
  let obj = parseCommonFields(row);

  let priority = row.cell('K').value();
  Helper.assign(obj, 'priority', Helper.parseEnum, false, priority, Object.values(Enum.PRIORITY));

  let zone = row.cell('L').value();
  Helper.assign(obj, 'zone', null, false, zone);

  let product_id = row.cell('M').value();
  Helper.assign(obj, 'product_id', null, false, product_id);

  let name = row.cell('N').value();
  Helper.assign(obj, 'name', null, false, name);

  let address = row.cell('O').value();
  Helper.assign(obj, 'address', null, false, address);

  let tel = row.cell('P').value();
  Helper.assign(obj, 'tel', null, false, tel);

  return obj;
}

/**
 * Parse stop sheet based on template type
 *
 * @param row
 * @param templateType
 * @return {*}
 */
function parseRow(row, templateType) {
  if (
    row.cell('A').value() === undefined &&
    row.cell('B').value() === undefined &&
    row.cell('C').value() === undefined
  ) {
    return null;
  }

  return templateType === Enum.JOB_TYPE.general ?
      parseGeneralRow(row) :
      parseMasterRow(row);
}

/**
 * Update list of stops, include client_vehicle_id and seq
 *
 * @param {int} jobId
 * @param {Array} stops
 * @param {int} stops.seq
 * @param {int} stops.plan_id
 * @param transaction
 * @return {Promise<void>}
 */
export async function updateStops(jobId, stops, transaction) {
  const fleet = await JobService.getLastFleet(jobId, transaction);
  const plans = await PlanService.findAllByFleetId(fleet.id, transaction);

  const promises = stops.map( async stop => {
    /** @type StopModel */
    let foundStop = await StopModel.findOne({
      where: {
        job_id: jobId,
        client_stop_id: stop.client_stop_id
      },
      transaction: transaction
    });

    if (!foundStop) {
      throw new Error(`Stop with job_id = ${jobId} and\
       client_stop_id = ${stop.client_stop_id} not exists`)
    }

    let isChanged = false;

    if (stop.plan_id !== undefined && foundStop.plan_id !== stop.plan_id) {
      foundStop.plan_id = stop.plan_id;
      isChanged = true;
    }

    if (stop.seq !== undefined && foundStop.seq !== stop.seq) {
      foundStop.seq = stop.seq;
      isChanged = true;
    }

    if (!isChanged) {
      logger.info(`Stop with job_id = ${jobId} and\
       client_stop_id = ${stop.client_stop_id} doesn't change, will not update`);

      return;
    }

    // log history
    let history = JSON.parse(foundStop.historical_client_vehicle_id_raw) || {};
    let plan = plans.find(plan => plan.id === stop.plan_id);

    let preClientVehicleId = plan ? plan.client_vehicle_id : null;
    history[fleet.id] = {
      client_vehicle_id: preClientVehicleId,
      seq: stop.seq,
      plan_id: stop.plan_id
    };

    foundStop.historical_client_vehicle_id_raw = JSON.stringify(history);

    return foundStop.save({transaction: transaction});
  });

  return Promise.all(promises);
}

/**
 * Set stops to become unserved, seq and client_vehicle_id to null
 *
 * @param jobId
 * @param unservedStops
 * @param transaction
 * @return {Promise<void>}
 */
export async function unservedStops(jobId, unservedStops, transaction) {
  let stops = unservedStops.map( clientStopId => {
    return {seq: null, client_stop_id: clientStopId, plan_id: null}
  });

  return updateStops(jobId, stops, transaction)
}

/**
 * Find stop sequence by job_id and client_vehicle_id and order by seq
 *
 * @param jobId
 * @param planId
 * @param transaction
 * @return {Promise<void>}
 */
export async function findSequence(jobId, planId, transaction) {
  let options = {
    where: {
      job_id: jobId,
      plan_id: planId
    },
    order: [['seq', 'asc']]
  };

  if (transaction) {
    options.transaction = transaction;
  }
  return StopModel.findAll(options);
}

/**
 * Each stop must exist in system
 *
 * @param jobId
 * @param clientVehicleId
 * @param stops
 * @param transaction
 */
export async function ableToReSequence(jobId, clientVehicleId, stops, transaction) {
  let stopSequence = await findSequence(jobId, clientVehicleId, transaction);

  const left = stopSequence.map(stop => {
    return util.format('%d:%s', stop.job_id, stop.client_stop_id)
  });

  const right = stops.map(stop => {
    return util.format('%d:%s', jobId, stop.client_stop_id)
  });

  return _.isEqual(left.sort(), right.sort());
}


/**
 * Check if can move stops around between two routes
 * List stops sent from client must match to stops in DB
 *
 * @param jobId
 * @param firstPlanId
 * @param firstStops
 * @param secondPlanId
 * @param secondStops
 * @param transaction
 */
export async function ableToMoveStops(jobId, firstPlanId, firstStops,
                                      secondPlanId, secondStops, transaction) {

  let firstStopSeq = await findSequence(jobId, firstPlanId, transaction);
  let secondStopSeq = await findSequence(jobId, secondPlanId, transaction);

  let mergedStopDbSeq = [...firstStopSeq, ...secondStopSeq];
  let left = mergedStopDbSeq.map( stop => {
    return util.format('%d:%s', stop.job_id, stop.client_stop_id)
  });

  let mergedStopClientSeq = [...firstStops, ...secondStops];
  let right = mergedStopClientSeq.map( stop => {
    return util.format('%d:%s', jobId, stop.client_stop_id)
  });

  return _.isEqual(left.sort(), right.sort());
}

/**
 * Check if stops is unserved
 *
 * @param jobId
 * @param clientStopIds
 * @param transaction
 * @return {undefined}
 */
export async function isUnserved(jobId, clientStopIds, transaction) {
  const Op = Sequelize.Op;
  let options = {
    where: {
      job_id: jobId,
      client_stop_id: {
        [Op.in]: clientStopIds
      }
    }
  };

  if (transaction) {
    options.transaction = transaction;
  }

  let foundStops = await StopModel.findAll(options);

  if (foundStops.length === 0) {
    throw new LogicError('Found stops is empty');
  }

  return foundStops.every(
    stop => stop.seq == null
    && stop.plan_id == null
  );
}


/**
 * Get list of unserved stops
 *
 * @return {Promise<void>}
 */
export async function getUnServed(jobId, transaction) {
  let options = {
    where: {
      job_id: jobId,
      plan_id: null,
      seq: null
    }
  };

  if (transaction) {
    options.transaction = transaction;
  }

  return StopModel.findAll(options);
}

/**
 *
 * @param jobId
 * @param clientVehicleId
 * @param checkPointSeq
 * @param newStopsSeq
 * @param transaction
 * @return {Promise<StopModel[]>}
 */
export async function getPartialStops(jobId, clientVehicleId, checkPointSeq, newStopsSeq, transaction) {
  let partialStops = newStopsSeq.filter(stop => stop.seq > checkPointSeq);

  const Op = Sequelize.Op;
  let options = {
    where: {
      job_id: jobId,
      client_stop_id: {
        [Op.in]: partialStops.map(stop => stop.client_stop_id)
      }
    }
  };

  if (transaction) {
    options.transaction = transaction;
  }

  let foundStops = await findAll(options);

  foundStops = foundStops.map(stop => {
    let newStopSeq = newStopsSeq
      .find(newStopSeq => newStopSeq.client_stop_id === stop.client_stop_id);

    stop.seq = newStopSeq.seq - checkPointSeq;
    stop.client_vehicle_id = clientVehicleId;

    return stop;
  });

  return foundStops;
}

/**
 * Find stop at check point
 *
 * @param jobId
 * @param planId
 * @param checkPointSeq
 * @param transaction
 * @return {Promise<*|Promise<Model>>}
 */
export async function findCheckPointStop(jobId, planId, checkPointSeq, transaction) {
  let options = {
    where: {
      job_id: jobId,
      seq: checkPointSeq,
      plan_id: planId
    }
  };

  if (transaction) {
    options.transaction = transaction;
  }

  return StopModel.findOne(options);
}

export function createFakeStop() {
  return {
    client_stop_id: null,
    client_vehicle_id: null,
    lat: null,
    lng: null,
    service_time: null,
    time_start: null,
    time_end: null,
    volume: null,
    weight: null,
    dropoffs: null,
    type: null,
    seq: null,
    priority: null,
    zone: null,
    product_id: null
  }
}

/**
 * Get history of stops
 *
 * @param jobId
 * @return {Promise<void>}
 */
export async function getStopsHistory(jobId) {
  let stopsHistory = {};
  /** @type {StopModel[]} */
  let stops = await findByJobId(jobId);

  for (let stop of stops) {
    stopsHistory[stop.client_stop_id] = stop.historical_client_vehicle_id;
  }

  return stopsHistory;
}

/**
 * Get pre vehicle id of stop
 *
 * @param {String} clientStopId
 * @param stopsHistory
 * @return {String}
 */
export function getPreClientVehicleId(clientStopId, stopsHistory) {
  let stopHistory = stopsHistory[clientStopId];
  if (stopHistory === null || Object.keys(stopHistory).length === 1) {
    return null;
  }

  const keys = Object.keys(stopHistory);
  const length = keys.length;
  const currentClientVehicleId = stopHistory[keys[length - 1]].client_vehicle_id;

  for(let index = length - 2; index >= 0; index--) {
    let key = keys[index];
    if (stopHistory[key].client_vehicle_id !== currentClientVehicleId) {
      return stopHistory[key].client_vehicle_id;
    }
  }

  return null;
}

