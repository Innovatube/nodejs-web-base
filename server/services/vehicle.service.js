import moment from 'moment';
import VehicleModel from '../models/vehicle.model';
import * as Helper from '../utils/helper';
import * as Enum from '../config/enum';
import {ValueError, StopSequenceNotChange} from "../errors";
import * as StopService from "./stop.service";
import _ from 'lodash';
import * as PlanService from "../services/plan.service";


export async function findById(id, options) {
  return VehicleModel.findById(id, options);
}

/**
 * Find vehicle by common ID
 *
 * @param {number} jodId
 * @param transaction
 * @returns {Promise<*>}
 */
export async function findByJobId(jodId, transaction) {
  let options = {
    where: {
      job_id: jodId
    }
  };

  if (transaction) {
    options.transaction = transaction;
  }

  return VehicleModel.findAll(options);
}

/**
 * Find vehicle by its job id and client vehicle id
 *
 * @param jobId
 * @param clientVehicleId
 * @param transaction
 * @return {Promise<*|Promise<Model>>}
 */
export async function findByJobIdAndClientVehicleId(jobId, clientVehicleId, transaction) {
  let options = {
    where: {
      job_id: jobId,
      client_vehicle_id: clientVehicleId
    }
  };

  if (transaction) {
    options.transaction = transaction;
  }

  return VehicleModel.findOne(options)
}

/**
 * Delete where by object
 *
 * @param where
 * @returns {Promise<*|Model>}
 */
export async function deleteWhere(where) {
  return VehicleModel.destroy({
    where: where
  });
}

/**
 * Validate excel sheet
 *
 * @return {Array}
 */
export function parseSheet(dataExcel, templateType) {
  const vehicleSheet = dataExcel.sheet('vehicles');
  if (!vehicleSheet) {
    throw new Error('Cannot read sheet vehicles')
  }

  let vehicles = [];
  vehicleSheet.forEachExistingRow(row => {
    // row 1 is instructions, ignore
    // row 2 is header
    if (row.rowNumber() === 2) {
      parseHeader(row, templateType);

    } else if (row.rowNumber() > 2) {
      let vehicle = parseRow(row, templateType);
      if (vehicle) {
        vehicles.push(vehicle);
      }
    }
  });

  return vehicles;
}

/**
 * Convert data excel to database
 *
 * @param {Object} dataExcel
 * @param {integer} jobId
 * @param templateType
 * @param transaction
 * @returns {Promise<*|Model>}
 */
export async function parseAndSaveToDB(dataExcel, jobId, templateType, transaction) {
  let vehicles = parseSheet(dataExcel, templateType);

  vehicles = vehicles.map( vehicle => {
    vehicle.job_id = jobId;
    return vehicle;
  });

  return VehicleModel.bulkCreate(vehicles, {transaction: transaction});
}

/**
 * Parse Header
 *
 * @param row
 * @param templateType
 */
export function parseHeader(row, templateType) {
  let isMaster = row.cell('A').value() === 'vehicle_id' &&
    row.cell('B').value() === 'lat_st' &&
    row.cell('C').value() === 'lng_st' &&
    row.cell('D').value() === 'lat_en' &&
    row.cell('E').value() === 'lng_en' &&
    row.cell('F').value() === 'time_st' &&
    row.cell('G').value() === 'time_en' &&
    row.cell('H').value() === 'speed_limit' &&
    row.cell('I').value() === 'break_time_st' &&
    row.cell('J').value() === 'break_time_en' &&
    row.cell('K').value() === 'volume' &&
    row.cell('L').value() === 'weight' &&
    row.cell('M').value() === 'type';

  let isGeneral = isMaster &&
    row.cell('N').value() === 'priority' &&
    row.cell('O').value() === 'time2leave' &&
    row.cell('P').value() === 'reverse_delivery';

  if (templateType === Enum.JOB_TYPE.general && !isGeneral) {
    throw new ValueError('Excel file is not general template, check vehicles sheet');
  }

  if (templateType === Enum.JOB_TYPE.master && !isMaster) {
    throw new ValueError('Excel file is not master template, check vehicles sheet');
  }
}

/**
 * Convert vehicleSheet to object database
 *
 * @param {Object} row
 * @param {integer} templateType
 * @returns {Promise<*|Model>}
 */
export function parseRow(row, templateType) {
  if (
    row.cell('A').value() === undefined &&
    row.cell('B').value() === undefined &&
    row.cell('C').value() === undefined
  ) {
    return null;
  }

  let obj = {};

  let clientVehicleId = row.cell('A').value();
  Helper.assign(obj, 'client_vehicle_id', null, true, clientVehicleId);

  let latStart = row.cell('B').value();
  Helper.assign(obj, 'lat_start', Helper.parseFloat, true, latStart);

  let lngStart = row.cell('C').value();
  Helper.assign(obj, 'lng_start', Helper.parseFloat, true, lngStart);

  let latEnd = row.cell('D').value();
  Helper.assign(obj, 'lat_end', Helper.parseFloat, false, latEnd);

  let lngEnd = row.cell('E').value();
  Helper.assign(obj, 'lng_end', Helper.parseFloat, false, lngEnd);

  let timeStart = row.cell('F').value();
  Helper.assign(obj, 'time_start', Helper.parseTime, false, timeStart, 'HH:mm:ss', 'HH:mm:ss');

  let timeEnd = row.cell('G').value();
  try {
    Helper.assign(obj, 'time_end', Helper.parseTime, false, timeEnd, 'HH:mm:ss', 'HH:mm:ss');
  } catch (e) {
    timeEnd = moment(timeStart, 'HH:mm:ss').minutes(parseInt(timeEnd) * 60);
    Helper.assign(obj, 'time_end', Helper.parseTime, false, timeEnd, 'HH:mm:ss', 'HH:mm:ss');
  }

  let speedLimit = row.cell('H').value();
  Helper.assign(obj, 'speed_limit', Helper.parseInt, false, speedLimit);

  let breakTimeStart = row.cell('I').value();
  Helper.assign(obj, 'break_time_start', Helper.parseTime, false, breakTimeStart, 'HH:mm:ss', 'HH:mm:ss');

  let breakTimeEnd = row.cell('J').value();
  Helper.assign(obj, 'break_time_end', Helper.parseTime, false, breakTimeEnd, 'HH:mm:ss', 'HH:mm:ss');

  let volume = row.cell('K').value();
  Helper.assign(obj, 'volume', Helper.parseFloat, false, volume);

  let weight = row.cell('L').value();
  Helper.assign(obj, 'weight', Helper.parseFloat, false, weight);

  let type = row.cell('M').value();
  Helper.assign(obj, 'type', Helper.parseEnum, false, type, Object.values(Enum.VEHICLE_TYPE));

  if (templateType === Enum.JOB_TYPE.general) {
    let priority = row.cell('N').value();
    Helper.assign(obj, 'priority', Helper.parseEnum, false, priority, Object.values(Enum.PRIORITY));

    let timeToLeave = row.cell('O').value();
    Helper.assign(obj, 'time_to_leave', Helper.parseInt, false, timeToLeave);

    let reverseDelivery = row.cell('P').value();
    Helper.assign(obj, 'reverse_delivery', Helper.parseInt, false, reverseDelivery);
  }

  return obj;
}

/**
 * Save vehicle
 *
 * @param data
 * @param options
 * @return {Promise<VehicleModel>}
 */
export async function save(data, options) {
  return VehicleModel.create(data, options)
}

/**
 * get last un-change seq
 *
 * @param {int} jobId
 * @param {int} planId
 * @param {Array} stops
 * @param {int} stops.client_stop_id
 * @param {int} stops.seq
 * @param transaction
 */
export async function getCheckPointSeq(jobId, planId, stops, transaction) {
  let checkPointSeq = 0;
  let stopSequence = await StopService.findSequence(jobId, planId, transaction);
  let sortedStopSequence = _.sortBy(stopSequence.map(stop => stop.toJSON()), 'seq');
  let sortedStops = _.sortBy(stops, 'seq');

  let max = Math.max(sortedStopSequence.length, sortedStops.length);
  for (let index = 0; index < max; index++) {
    if (!sortedStopSequence[index] || !stops[index]) {
      break;
    }

    if (sortedStopSequence[index].client_stop_id !== stops[index].client_stop_id) {
      break;
    }

    checkPointSeq++;
  }

  if (checkPointSeq === stops.length && checkPointSeq > 0 && checkPointSeq < max) {
    checkPointSeq--;
  }

  if (checkPointSeq === max) {
    throw new StopSequenceNotChange('Stop sequence does not change')
  }

  return checkPointSeq;
}

/**
 * Get new location of vehicle
 *
 * @param jobId
 * @param clientVehicleId
 * @param checkPointSeq
 * @param transaction
 * @return {Promise<VehicleModel>}
 */
export async function getPartialVehicle(jobId, clientVehicleId, checkPointSeq, transaction) {
  let plan = await PlanService.findById(clientVehicleId, {
    transaction: transaction,
    include: ['legs']
  });
  /** @type {VehicleModel} */
  let vehicle = await findByJobIdAndClientVehicleId(jobId, plan.client_vehicle_id, transaction);
  let vehicleJson = vehicle.toJSON();

  // rename client vehicle id
  vehicleJson.client_vehicle_id = clientVehicleId;

  if (plan && plan.is_draft === false) {
    // set time time by plan
    const isStartAtVehicleTimeStart = vehicle.time_start === Helper.extractTime(plan.time_start);
    if (!isStartAtVehicleTimeStart) {
      vehicleJson.time_start = Helper.extractTime(plan.time_start);
    }

    let leg = plan.legs.find(leg => leg.seq === checkPointSeq);
    if (leg) {
      // update vehicle start time, using finish time value of last un-change stop
      vehicleJson.time_start = Helper.extractTime(leg.finish_time);

      // update new location of vehicle
      let lastUnchangedStop = await StopService.findCheckPointStop(jobId, clientVehicleId, checkPointSeq, transaction);
      vehicleJson.lat_start = lastUnchangedStop.lat;
      vehicleJson.lng_start = lastUnchangedStop.lng;
    }
  }

  return vehicleJson;
}