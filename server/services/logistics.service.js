import * as Enum from '../config/enum';
import * as FleetService from './fleet.service';
import * as PlanService from './plan.service';
import * as LegService from './leg.service';
import * as StopService from './stop.service';
import * as VehicleService from './vehicle.service';
import * as TaskService from './task.service';
import * as JobService from './job.service';
import * as LogisticsClient from '../utils/logistics.client';
import logger from '../config/winston';
import {LogicError} from "../errors";
import * as Helper from '../utils/helper';
import _ from "lodash";
import moment from 'moment';

export default class LogisticsService {
  /**
   * Create routes
   *
   * @param task
   * @param transaction
   * @returns {Promise<void>}
   */
  static async createRoutes(task, transaction) {
    let res = await LogisticsClient.createRoutes(task);
    task.long_running_id = res[0].job_id;
    task.response = JSON.stringify(res);
    await task.save({transaction: transaction});
    await TaskService.setStatus(task, Enum.TASK_STATUS.running, transaction);

    return task;
  }

  /**
   * Only request parts that change to logistics API
   *
   * @param task
   * @param transaction
   * @return {Promise<void>}
   */
  static async partialEditRoutes(task, transaction) {
    let res = await LogisticsClient.partialEditRoutes(task);

    // update logistics request
    task.response = JSON.stringify(res);
    task.long_running_id = res[0].job_id;
    task.save({transaction: transaction});
    await TaskService.setStatus(task, Enum.TASK_STATUS.partial_running, transaction);

    return task;
  }

  /**
   * Get stask status, if success, save data to DB
   *
   *  [
   {
        "Status": "53",
        "StartReq": "2018-08-28 13:34:32"
    }
   ]
   *
   * @param task
   * @param transaction
   * @returns {Promise<void>}
   */
  static async getStatusAndSave(task, transaction) {
    let res = await LogisticsClient.getStatus(task);
    let savedFleet;

    if (!res[0].FleetsResult) {
      logger.info('Long running job with id: ' + task.id + ' is still running');
      return res[0].Status;
    }
    if (task.status === Enum.TASK_STATUS.running) {
      savedFleet = await LogisticsService.saveFullData(task, res, transaction);

    } else if (task.status === Enum.TASK_STATUS.partial_running) {
      savedFleet = await LogisticsService.mergePartialData(task, res, transaction);

    } else {
      throw new LogicError('Invalid task status');
    }

    // Get full fleet
    let fullFleet = await FleetService.getFullById(savedFleet.id, transaction);
    // Update to completed
    task.result = JSON.stringify(res);
    task.merged_result = JSON.stringify(fullFleet);
    task.save({transaction: transaction});
    await TaskService.setStatus(task, Enum.TASK_STATUS.success, transaction);

    return true;
  }

  /**
   * Cancel Task
   *
   * @param task
   * @param user
   * @returns {Promise<boolean>}
   */
  static async cancel(task, user) {
    let res = await LogisticsClient.cancel(task, user);
    await TaskService.setStatus(task, Enum.TASK_STATUS.cancelled);
    return true;
  }

  /**
   * Parse response and save to fleets, plans, legs table
   * Update client_vehicle_id and seq for stops table
   * Update stops, set seq and client_vehicle_id to null if unserved
   *
   * @param {object} task
   * @param res
   * @param transaction
   * @returns {Promise<void>}
   */
  static async saveFullData(task, res, transaction) {
    let responseFleet = res[0].FleetsResult[0];
    let responsePlans = res[1].Plan;
    let vehicles = await VehicleService.findByJobId(task.job_id);

    let preparedFleet = {
      job_id: task.job_id,
      task_id: task.id,
      status: responseFleet.Status,
      description: responseFleet.Description,
      total_wait_time: parseFloat(responseFleet.TotalWaitTime),
      total_eta: parseFloat(responseFleet.TotalETA),
      total_time: parseFloat(responseFleet.TotalTime),
      total_distance: parseFloat(responseFleet.TotalDistance),
      total_service_time: parseFloat(responseFleet.TotalServiceTime),
      total_toll_fee: parseFloat(responseFleet.TotalTollFee),
      total_volume: parseFloat(responseFleet.TotalVolume),
      total_weight: parseFloat(responseFleet.TotalWeight),
      unserved: responseFleet.Unserved
    };

    let savedFleet = await FleetService.save(preparedFleet, {transaction: transaction});

    for (let responsePlan of responsePlans) {
      let vehicle = vehicles.find(vehicle => vehicle.client_vehicle_id === responsePlan.Vehicle);
      let preparedPlan = {
        fleet_id: savedFleet.id,
        client_vehicle_id: responsePlan.Vehicle,
        vehicle_id: vehicle.id,
        time_start: responsePlan.StartTime,
        time_end: responsePlan.EndTime,
        num_of_route: responsePlan.NumOfRoute,
        total_wait_time: parseFloat(responsePlan.TotalWaitTime),
        total_eta: parseFloat(responsePlan.TotalETA),
        total_time: parseFloat(responsePlan.TotalTime),
        total_distance: parseFloat(responsePlan.TotalDistance),
        total_service_time: parseFloat(responsePlan.TotalServiceTime),
        total_toll_fee: parseFloat(responsePlan.TotalTollFee),
        total_volume: parseFloat(responsePlan.TotalVolume),
        total_weight: parseFloat(responsePlan.TotalWeight),
        percentage_weight: parseFloat(responsePlan.PercentWeight),
        percentage_volume: parseFloat(responsePlan.PercentVolume)
      };

      let savedPlan = await PlanService.save(preparedPlan, {transaction: transaction});

      let preparedLegs = [];
      let stopSeq = [];
      responsePlan.Legs.forEach(async responseLeg => {
        let preparedLeg = {
          plan_id: savedPlan.id,
          seq: parseInt(responseLeg.Seq),
          start_id: responseLeg.StartID,
          stop_id: responseLeg.StopID,
          arrive_time: responseLeg.ArriveTime,
          finish_time: responseLeg.FinishTime,
          wait_time: parseFloat(responseLeg.WaitTime),
          eta: parseFloat(responseLeg.ETA),
          distance: parseFloat(responseLeg.Distance),
          service_time: parseFloat(responseLeg.ServiceTime),
          toll_fee: parseFloat(responseLeg.TollFee),
          volume: parseFloat(responseLeg.Volume),
          weight: parseFloat(responseLeg.Weight),
          route: responseLeg.Route
        };

        preparedLegs.push(preparedLeg);

        // Update stop seq and client_vehicle_id here
        if (preparedLeg.stop_id !== responsePlan.Vehicle) {
          stopSeq.push({
            seq: preparedLeg.seq,
            client_stop_id: preparedLeg.stop_id,
            plan_id: savedPlan.id
          });
        }
      });

      await LegService.bulkSave(preparedLegs, {transaction: transaction});
      await StopService.updateStops(task.job_id, stopSeq, transaction);
    }

    // Update stops, set seq and client_vehicle_id to null if unserved
    if (responseFleet.Status === Enum.FLEET_STATUS.uncompleted) {
      logger.info(`Task id: ${task.id} is uncompleted, set stops: ${responseFleet.Unserved} to unserved`);

      let unservedStops = responseFleet.Unserved.split(',');
      await StopService.unservedStops(task.job_id, unservedStops, transaction);
    }

    return savedFleet;
  }

  /**
   * Merge partial data
   *
   * @param {TaskModel} task
   * @param {Object} res
   * @param transaction
   * @return {Promise<FleetModel>}
   * @private
   */
  static async mergePartialData(task, res, transaction) {
    let lastFleet = await JobService.getLastFleet(task.job_id, transaction);
    lastFleet = await FleetService.getFullById(lastFleet.id, transaction);
    let lastPlans = lastFleet.plans;

    // split response
    if (task.split_point_plans) {
      res = await LogisticsService.splitResponse(task, res, transaction);
      logger.info(`After split: ${JSON.stringify(res)}`);
    }

    let responseFleet = res[0].FleetsResult[0];
    let responsePlans = res[1].Plan;

    let savedCloneFleet = await LogisticsService.cloneFleet(lastFleet, task, transaction);

    let mergedPlans = await LogisticsService
      .clonePlans(task, savedCloneFleet, lastPlans, responsePlans, transaction);

    // process time diff
    if (task.finish_time_adjust) {
      await LogisticsService.processTimeAdjust(lastPlans, mergedPlans, task, transaction);
    }

    // Update stops, set seq and client_vehicle_id to null if unserved
    await LogisticsService.setPartialStopsUnServed(responseFleet, task, transaction);

    // Update unserved of fleet
    await LogisticsService.updateFleetUnServed(savedCloneFleet, task, transaction);

    // Re-calculate clone fleet
    await FleetService.recalculateProps(savedCloneFleet, mergedPlans, transaction);

    return savedCloneFleet;
  }

  /**
   * Clone plans
   *
   * @param {TaskModel} task
   * @param {FleetModel} savedCloneFleet
   * @param {PlanModel[]} oldPlans
   * @param {Object} responsePlans
   * @param transaction
   * @return {Promise<PlanModel[]>}
   */
  static async clonePlans(task, savedCloneFleet, oldPlans, responsePlans, transaction) {
    let mergedPlans = [];
    for (let plan of oldPlans) {
      if (!task.check_points_plan.includes(plan.id)) {
        // clone exact this plan and its legs
        logger.info(`[PLAN-UNCHANGED] ---------> Plan ID (${plan.id}#${plan.client_vehicle_id}) \
        is not change, start cloning`);

        let unChangePlans = await LogisticsService
          .cloneUnChangePlanAndItsLegs(task.job_id, plan, savedCloneFleet, transaction);

        mergedPlans.push(unChangePlans);
      } else {
        // Plan is changed

        // Find response plan by its vehicle. Here vehicle name is plan.id
        // ResponsePlan here is always int becuase we change vehicle id to plan id
        let responsePlan = responsePlans.find(responsePlan => parseInt(responsePlan.Vehicle) === plan.id);
        if (!responsePlan) {
          logger.info(`[PLAN-EMPTY] ---------> Plan ID (${plan.id}#${plan.client_vehicle_id}) \
          is change, but cannot applied any new legs`);

          continue;
        }

        let checkPoint = task.check_points.find(cp => cp.plan_id === plan.id);
        if (checkPoint.seq === 0) {
          // Insert entirely new plan
          logger.info(`[PLAN-CHANGED-ENTIRELY] ---------> Plan ID (${plan.id}#${plan.client_vehicle_id}) \
          is changed entirely, start inserting`);

          let newSavedPlan = await LogisticsService
            .saveNewPlanAndItsLegs(plan, responsePlan, savedCloneFleet.id, task.job_id, transaction);

          mergedPlans.push(newSavedPlan);

        } else {
          // Only insert changed legs
          logger.info(`[PLAN-CHANGED-PARTIALLY] --------> Plan ID (${plan.id}#${plan.client_vehicle_id}) \
          is changed partially, start cloning and replacing`);

          let cloneChangedPlan = await LogisticsService
            .cloneChangedPlanAndItsLegs(plan, responsePlan, checkPoint.seq, savedCloneFleet, transaction);

          mergedPlans.push(cloneChangedPlan);
        }
      }
    }

    return mergedPlans;
  }

  /**
   * Clone fleet from last fleet
   *
   * @param lastFleet
   * @param task
   * @param transaction
   * @return {Promise<FleetModel>}
   */
  static async cloneFleet(lastFleet, task, transaction) {
    let preparedFleet = {
      job_id: task.job_id,
      task_id: task.id,
      description: 'Merged'
    };

    logger.info('[FLEET] ----------> Clone fleet');
    return await FleetService.save(preparedFleet, {transaction: transaction});
  }

  /**
   * Clone un-change plan, set new fleet id for plan
   *
   * @param jobId
   * @param {PlanModel} plan
   * @param {FleetModel} cloneFleet
   * @param transaction
   * @return {Promise<void>}
   */
  static async cloneUnChangePlanAndItsLegs(jobId, plan, cloneFleet, transaction) {
    // Not clone un-changed plan that is draft
    if (plan.is_draft === true) {
      logger.info(`[PLAN-UNCHANGED] ---------> Plan ID (${plan.id}#${plan.client_vehicle_id}) \
        is draft, not clone`);
      return;
    }

    let stopsSeq = [];
    let clonePlan = {
      fleet_id: cloneFleet.id,
      client_vehicle_id: plan.client_vehicle_id,
      vehicle_id: plan.vehicle_id,
      time_start: plan.time_start,
      time_end: plan.time_end,
      num_of_route: plan.num_of_route,
      total_wait_time: plan.total_wait_time,
      total_eta: plan.total_eta,
      total_time: plan.total_time,
      total_distance: plan.total_distance,
      total_service_time: plan.total_service_time,
      total_toll_fee: plan.total_toll_fee,
      total_volume: plan.total_volume,
      total_weight: plan.total_weight,
      percentage_weight: plan.percentage_weight,
      percentage_volume: plan.percentage_volume,
      duplicate_of: plan.id
    };

    let savedClonePlan = await PlanService.save(clonePlan, {transaction: transaction});

    // Clone legs
    let preparedLegs = [];
    plan.legs.forEach(leg => {
      let preparedLeg = leg.toJSON();
      preparedLeg.plan_id = savedClonePlan.id;
      delete preparedLeg.id;

      preparedLegs.push(preparedLeg);

      // prepare stops seq
      if (leg.stop_id !== savedClonePlan.client_vehicle_id) {
        stopsSeq.push({
          seq: leg.seq,
          client_stop_id: leg.stop_id,
          plan_id: savedClonePlan.id
        });
      }
    });

    logger.info(`[LEG-UNCHANGED] ----------> Cloned legs of un-change Plan \
    (${plan.id}#${plan.client_vehicle_id}) successfully`);

    await LegService.bulkSave(preparedLegs, {transaction: transaction});

    // Update stop seq and client_vehicle_id here
    await StopService.updateStops(jobId, stopsSeq, transaction);

    return savedClonePlan;
  }

  /**
   * Clone changed-plan and its legs
   *
   * @param {PlanModel} plan
   * @param {Object} responsePlan
   * @param {int} checkPointSeq
   * @param {FleetModel} cloneFleet
   * @param transaction
   * @return {Promise<void>}
   */
  static async cloneChangedPlanAndItsLegs(plan, responsePlan, checkPointSeq, cloneFleet, transaction) {
    let clonePlan = {
      fleet_id: cloneFleet.id,
      client_vehicle_id: plan.client_vehicle_id,
      vehicle_id: plan.vehicle_id,
      duplicate_of: plan.id
    };

    let savedClonePlan = await PlanService.save(clonePlan, {transaction: transaction});

    // Clone un-change legs
    let unChangedLegs = await LogisticsService.cloneUnChangeLegs(cloneFleet.job_id, plan, savedClonePlan.id, checkPointSeq, transaction);
    logger.info(`[LEG-UNCHANGED] ------> Clone un-change legs of changed-Plan \
    (${plan.id}#${plan.client_vehicle_id}) till seq ${checkPointSeq} successfully`);

    // Replace change-legs
    let replacedLegs = await LogisticsService
      .replaceChangedLegs(cloneFleet.job_id, plan, responsePlan, savedClonePlan.id, checkPointSeq, transaction);
    logger.info(`[LEG-REPLACED] ------> Replace changed legs of changed-Plan\ 
    (${plan.id}#${plan.client_vehicle_id}) from seq ${checkPointSeq} successfully`);

    // Re-calculate plan properties
    let mergedLegs = [...unChangedLegs, ...replacedLegs];
    logger.info(`[CALCULATE-PLAN] ------> Re-calculate Plan (${plan.id}#${plan.client_vehicle_id})`);
    await PlanService.reCaculateProps(savedClonePlan, plan.time_start, mergedLegs, cloneFleet.job_id, transaction);

    return savedClonePlan;
  }

  /**
   * Loop all legs, save un-change legs
   *
   * @param jobId
   * @param lastPlan
   * @param savedClonePlanId
   * @param updatePointSeq
   * @param transaction
   * @return {Promise<Array<Model>>}
   */
  static async cloneUnChangeLegs(jobId, lastPlan, savedClonePlanId, updatePointSeq, transaction) {
    let cloneUnChangeLegs = [];
    let stopsSeq = [];

    for (let leg of lastPlan.legs) {
      if (leg.seq <= updatePointSeq) {
        let cloneLeg = leg.toJSON();
        cloneLeg.plan_id = savedClonePlanId;
        cloneLeg.client_vehicle_id = lastPlan.client_vehicle_id;
        delete cloneLeg.id;

        cloneUnChangeLegs.push(cloneLeg);

        if (cloneLeg.stop_id !== lastPlan.client_vehicle_id) {
          stopsSeq.push({
            seq: cloneLeg.seq,
            client_stop_id: leg.stop_id,
            plan_id: savedClonePlanId
          });
        }
      }
    }

    // Update stop seq and client_vehicle_id here
    await StopService.updateStops(jobId, stopsSeq, transaction);

    return LegService.bulkSave(cloneUnChangeLegs, {transaction: transaction});
  }

  /**
   *  Clone legs from update poin seq
   *
   * @param jobId
   * @param {PlanModel} plan
   * @param responsePlan
   * @param savedClonePlanId
   * @param checkPointSeq
   * @param transaction
   * @return {Promise<Array<Model>>}
   */
  static async replaceChangedLegs(jobId, plan, responsePlan, savedClonePlanId, checkPointSeq, transaction) {
    let replaceLegs = [];
    let responseLegs = responsePlan.Legs;
    let stopsSeq = [];
    if (!responseLegs || responseLegs.length === 0) {
      throw new LogicError('Partial legs cannot be empty');
    }

    for (let index in responseLegs) {
      let responseLeg = responseLegs[index];
      let replaceLeg = {
        plan_id: savedClonePlanId,
        seq: parseInt(responseLeg.Seq) + checkPointSeq,
        stop_id: responseLeg.StopID,
        arrive_time: responseLeg.ArriveTime,
        finish_time: responseLeg.FinishTime,
        wait_time: parseFloat(responseLeg.WaitTime),
        eta: parseFloat(responseLeg.ETA),
        distance: parseFloat(responseLeg.Distance),
        service_time: parseFloat(responseLeg.ServiceTime),
        toll_fee: parseFloat(responseLeg.TollFee),
        volume: parseFloat(responseLeg.Volume),
        weight: parseFloat(responseLeg.Weight),
        route: responseLeg.Route
      };

      // Update start, stop id for first new leg
      if (replaceLeg.seq === checkPointSeq + 1) {
        if (checkPointSeq === 0) {
          replaceLeg.start_id = plan.client_vehicle_id;

        } else {
          let legs = plan.legs;
          let lastUnchangeLeg = legs.find(leg => leg.seq === checkPointSeq);
          if (!lastUnchangeLeg) {

            throw new LogicError('Last unchange leg cannot be null')
          }

          replaceLeg.start_id = lastUnchangeLeg.stop_id;
        }
      } else {
        replaceLeg.start_id = responseLeg.StartID;
      }

      // if last response leg, override with real client vehicle id
      if (parseInt(index) === responseLegs.length - 1 && responseLegs[0].StartID === responseLeg.StopID) {
        replaceLeg.stop_id = plan.client_vehicle_id;
      }

      replaceLegs.push(replaceLeg);

      // prepare stops seq
      if (replaceLeg.stop_id !== plan.client_vehicle_id) {
        stopsSeq.push({
          seq: replaceLeg.seq,
          client_stop_id: replaceLeg.stop_id,
          plan_id: savedClonePlanId
        });
      }
    }

    // Update stop seq and client_vehicle_id here
    await StopService.updateStops(jobId, stopsSeq, transaction);

    return LegService.bulkSave(replaceLegs, {transaction: transaction});
  }

  /**
   * Save new plan
   *
   * @param {PlanModel} plan
   * @param responsePlan
   * @param fleetId
   * @param jobId
   * @param transaction
   * @return {Promise<void>}
   */
  static async saveNewPlanAndItsLegs(plan, responsePlan, fleetId, jobId, transaction) {
    /** @type {VehicleModel} */
    let vehicle = await VehicleService
      .findByJobIdAndClientVehicleId(jobId, plan.client_vehicle_id);

    let preparedPlan = {
      fleet_id: fleetId,
      client_vehicle_id: plan.client_vehicle_id,
      vehicle_id: vehicle.id,
      time_start: Helper.parseDateTime(responsePlan.StartTime),
      time_end: Helper.parseDateTime(responsePlan.EndTime),
      num_of_route: Helper.parseInt(responsePlan.NumOfRoute),
      total_wait_time: parseFloat(responsePlan.TotalWaitTime),
      total_eta: parseFloat(responsePlan.TotalETA),
      total_time: parseFloat(responsePlan.TotalTime),
      total_distance: parseFloat(responsePlan.TotalDistance),
      total_service_time: parseFloat(responsePlan.TotalServiceTime),
      total_toll_fee: parseFloat(responsePlan.TotalTollFee),
      total_volume: parseFloat(responsePlan.TotalVolume),
      total_weight: parseFloat(responsePlan.TotalWeight),
      percentage_weight: parseFloat(responsePlan.PercentWeight),
      percentage_volume: parseFloat(responsePlan.PercentVolume),
      duplicate_of: plan.id
    };

    let savedPlan = await PlanService.save(preparedPlan, {transaction: transaction});

    let preparedLegs = [];
    let stopSeq = [];

    responsePlan.Legs.forEach((responseLeg, index) => {
      let stopId = responseLeg.StopID;

      if (index === responsePlan.Legs.length - 1 && responseLeg.StopID === responsePlan.Legs[0].StartID) {
        stopId = vehicle.client_vehicle_id;
      }

      let preparedLeg = {
        plan_id: savedPlan.id,
        seq: Helper.parseInt(responseLeg.Seq),
        start_id: index === 0 ? vehicle.client_vehicle_id : responseLeg.StartID,
        stop_id: stopId,
        arrive_time: Helper.parseDateTime(responseLeg.ArriveTime),
        finish_time: Helper.parseDateTime(responseLeg.FinishTime),
        wait_time: parseFloat(responseLeg.WaitTime),
        eta: parseFloat(responseLeg.ETA),
        distance: parseFloat(responseLeg.Distance),
        service_time: parseFloat(responseLeg.ServiceTime),
        toll_fee: parseFloat(responseLeg.TollFee),
        volume: parseFloat(responseLeg.Volume),
        weight: parseFloat(responseLeg.Weight),
        route: responseLeg.Route
      };

      preparedLegs.push(preparedLeg);
      if (preparedLeg.stop_id !== vehicle.client_vehicle_id) {
        stopSeq.push({
          seq: preparedLeg.seq,
          client_stop_id: preparedLeg.stop_id,
          plan_id: savedPlan.id
        });
      }
    });

    logger.info(`[LEGS-CHANGE-ALL] ----> Insert all legs to plan\ 
    ${plan.id}#${plan.client_vehicle_id}), legs: ${JSON.stringify(preparedLegs)}`);

    await LegService.bulkSave(preparedLegs, {transaction: transaction});
    // Update stop seq and client_vehicle_id here
    await StopService.updateStops(jobId, stopSeq, transaction);

    return savedPlan;
  }

  /**
   * Update stops of partial task unserved
   * @param {Object} responseFleet
   * @param {TaskModel} task
   * @param transaction
   * @return {Promise<void>}
   */
  static async setPartialStopsUnServed(responseFleet, task, transaction) {
    if (responseFleet.Status === Enum.FLEET_STATUS.uncompleted) {
      logger.info(`Job id: ${task.job_id} is uncompleted,\ 
      set stops: ${responseFleet.Unserved} to unserved`);

      let unservedStops = responseFleet.Unserved.split(',');
      await StopService.unservedStops(task.job_id, unservedStops, transaction);
    }
  }

  /**
   * Update unserved fields of fleet
   *
   * @param {FleetModel} savedCloneFleet
   * @param {TaskModel} task
   * @param transaction
   */
  static async updateFleetUnServed(savedCloneFleet, task, transaction) {
    let unServedStops = await StopService.getUnServed(task.job_id, transaction);
    let unserved = unServedStops.map(stop => stop.client_stop_id).join(',') || null;

    savedCloneFleet.unserved = unserved;
    savedCloneFleet.status = unserved
      ? Enum.FLEET_STATUS.uncompleted
      : Enum.FLEET_STATUS.success;

    await savedCloneFleet.save({transaction: transaction});
  }

  /**
   * split res into multiple plans
   *
   * @param {TaskModel} task
   * @param res
   * @param transaction
   */
  static async splitResponse(task, res, transaction) {
    let responseFleet = res[0].FleetsResult[0];
    let responsePlans = res[1].Plan;
    let newRes = [];
    let newResponsePlans = [];

    let lastFleet = await JobService.getLastFleet(task.job_id, transaction);
    let plans = await PlanService.findAllByFleetId(lastFleet.id, transaction);
    let vehicles = await VehicleService.findByJobId(task.job_id, transaction);
    let splitPointPlans = task.split_point_plans;

    responsePlans.forEach(responsePlan => {
      // not have to split
      if (!Object.keys(splitPointPlans).includes(responsePlan.Vehicle)) {
        newResponsePlans.push(responsePlan)

      } else {
        // start splitting
        const splitPoints = splitPointPlans[responsePlan.Vehicle];
        const responseLegs = responsePlan.Legs;

        for (let splitPoint of splitPoints) {
          let legs = responseLegs.slice(splitPoint.from, splitPoint.to);
          // Meaning empty plan
          if (legs.length === 0) {
            continue;
          }

          legs = legs.map((leg, legIndex) => {
            if (legIndex === 0) {
              leg.StartID = splitPoint.plan_id;
            }

            if (legIndex === legs.length - 1) {
              leg.StopID = splitPoint.plan_id;
            }

            leg.Seq = parseInt(leg.Seq) - splitPoint.from;

            return leg;
          });

          let newResponsePlan = {
            Vehicle: splitPoint.plan_id,
            Legs: legs
          };

          let plan = plans.find(plan => plan.id === parseInt(splitPoint.plan_id));
          let vehicle = vehicles.find(vehicle => vehicle.client_vehicle_id === plan.client_vehicle_id);
          let startTime;

          if (splitPoint.from === 0) {
            startTime = responsePlan.StartTime;
          } else {
            startTime = responseLegs[splitPoint.from - 1].FinishTime
          }
          newResponsePlan = LogisticsService
            .reCalculateResponsePlan(newResponsePlan, startTime, vehicle);

          newResponsePlans.push(newResponsePlan);
        }
      }
    });

    newRes.push({FleetsResult: [responseFleet]});
    newRes.push({Plan: newResponsePlans});

    return newRes;
  }

  /**
   *
   * @param {Object} responsePlan
   * @param startTime
   * @param {VehicleModel} vehicle
   */
  static reCalculateResponsePlan(responsePlan, startTime, vehicle) {
    const responseLegs = responsePlan.Legs;
    const lastLeg = responseLegs[responseLegs.length - 1];

    responsePlan.Legs = responsePlan.Legs.map(leg => {
      leg.WaitTime = parseInt(leg.WaitTime);
      leg.ETA = parseInt(leg.ETA);
      leg.Distance = parseFloat(leg.Distance);
      leg.ServiceTime = parseInt(leg.ServiceTime);
      leg.TollFee = parseFloat(leg.TollFee);
      leg.Volume = parseFloat(leg.Volume);
      leg.Weight = parseFloat(leg.Weight);

      return leg;
    });

    responsePlan.StartTime = startTime;
    responsePlan.EndTime = lastLeg.FinishTime;
    responsePlan.NumOfRoute = responseLegs.length;
    responsePlan.TotalWaitTime = _.sumBy(responseLegs, 'WaitTime');
    responsePlan.TotalETA = _.sumBy(responseLegs, 'ETA');
    responsePlan.TotalTime = responsePlan.TotalETA + responsePlan.TotalWaitTime;
    responsePlan.TotalDistance = _.sumBy(responseLegs, 'Distance');
    responsePlan.TotalServiceTime = _.sumBy(responseLegs, 'ServiceTime');
    responsePlan.TotalTollFee = _.sumBy(responseLegs, 'TollFee');
    responsePlan.TotalVolume = _.sumBy(responseLegs, 'Volume');
    responsePlan.TotalWeight = _.sumBy(responseLegs, 'Weight');
    responsePlan.PercentVolume = Math.round(parseFloat(responsePlan.TotalVolume) / vehicle.volume * 100);
    responsePlan.PercentWeight = Math.round(parseFloat(responsePlan.TotalWeight) / vehicle.weight * 100);

    return responsePlan;
  }

  /**
   * @TODO optimize query
   * Increase all subsequent plan by amount of time
   * @param {PlanModel[]} lastPlans
   * @param {PlanModel[]} mergedPlans
   * @param {TaskModel} task
   * @param transaction
   * @return {Promise<void>}
   */
  static async processTimeAdjust(lastPlans, mergedPlans, task, transaction) {
    const format = 'YYYY-MM-DD HH:mm:ss';
    const diffUnit = 'seconds';

    function logTimeAdjustment(from, to, diff) {
      from = moment.isMoment(from) ? from : moment(from);
      to = moment.isMoment(to) ? to : moment(to);
      logger.info('-------------------------------------');
      logger.info(`FROM: ${moment(from).format(format)}`);
      logger.info(`TO: ${moment(to).format(format)}`);
      logger.info(`Diff: ${diff} seconds`);
      logger.info('-------------------------------------');
    }

    for (let planId of task.finish_time_adjust) {
      let originalPlan = lastPlans.find(plan => plan.id === planId);
      let duplicatePlan = mergedPlans.find(plan => plan.duplicate_of === planId);

      if (!duplicatePlan) {
        return;
      }

      const diffInSecond = moment(duplicatePlan.time_end).diff(moment(originalPlan.time_end), diffUnit);
      logger.info('Find different in second');
      logTimeAdjustment(originalPlan.time_end, duplicatePlan.time_end);

      let subsequentDuplicatePlans = await PlanService.getSubsequentPlans(duplicatePlan, transaction, true);
      logger.info(`Find subsequent plans for plan ID ${planId}`);

      if (subsequentDuplicatePlans.length === 0) {
        logger.info(`No subsequent plans found for plan ID ${duplicatePlan.id}`);
        return;
      }

      for (let subsequentDupPlan of subsequentDuplicatePlans) {
        let subsequentDupLegs = subsequentDupPlan.legs;
        for (let subsequentDupLeg of subsequentDupLegs) {
          let newArriveTime = moment(subsequentDupLeg.arrive_time).add(diffInSecond, diffUnit);
          let newFinishTime = moment(subsequentDupLeg.finish_time).add(diffInSecond, diffUnit);

          logger.info(`New arrive time for LEG ID ${subsequentDupLeg.id}`);
          logTimeAdjustment(subsequentDupLeg.arrive_time, newArriveTime, diffInSecond);

          logger.info(`New finish time for LEG ID ${subsequentDupLeg.id}`);
          logTimeAdjustment(subsequentDupLeg.finish_time, newFinishTime, diffInSecond);

          subsequentDupLeg.arrive_time = newArriveTime.format(format);
          subsequentDupLeg.finish_time = newFinishTime.format(format);

          subsequentDupLeg.save({transaction: transaction});
        }

        let newTimeSart = moment(subsequentDupPlan.time_start).add(diffInSecond, diffUnit);
        let newTimeEnd = moment(subsequentDupPlan.time_end).add(diffInSecond, diffUnit);

        logger.info(`New time start for Plan ID ${subsequentDupPlan.id}`);
        logTimeAdjustment(subsequentDupPlan.time_start, newTimeSart, diffInSecond);

        logger.info(`New time end for Plan ID ${subsequentDupPlan.id}`);
        logTimeAdjustment(subsequentDupPlan.time_end, newTimeEnd, diffInSecond);

        subsequentDupPlan.time_start = newTimeSart.format(format);
        subsequentDupPlan.time_end = newTimeEnd.format(format);
        subsequentDupPlan.save({transaction: transaction});
      }
    }
  }
}
