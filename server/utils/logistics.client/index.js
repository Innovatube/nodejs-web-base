import * as Enum from "../../config/enum";
import Request from './request'
import GeneralRequest from './general_request'
import MasterRequest from './master_request'
import {ValueError} from "../../errors";

/**
  0	No error
 10	Require post stops parameters at least 3 items!
 11	Post stops parameters wrong!
 11	Stop's location invalid! @line No. [line of param]
 11	Stop's location out of service area! @line No. [line of param]
 11	Stop's time value invalid! @line No. [line of param]
 11	Stop's volume/weight value invalid! @line No. [line of param]
 12	Require post vehicles parameters at least 3 items!
 13	Post vehicles parameters wrong!
 13	Vehicles's location invalid! @line No. [line of param]
 13	Vehicles's location out of service area! @line No. [line of param]
 13	Vehicles's time value invalid! @line No. [line of param]
 13	Vehicles's volume/weight value invalid! @line No. [line of param]
 14	Post commons parameters wrong!
 15	Post user parameters wrong!
 16	Post job id parameters wrong!
 20	Queue is full, Please try again!
 21	Can not optimize route!
 22	No this job in queue!, Please check your job_id and user!
 23	Sorry, Your previous task has been processing. Please get status @job_id: [JobID]
 90	Sorry - we couldn't find a route for you today. Can you check your vehicle/stop inputs?
 50	You have no permission!
 51	Your account was expired!
 52	Amount of vehicle exceed your quota!
 53	Amount of stop exceed your quota!

 */

export class LogisticsError extends Error {
  constructor(message, code) {
    const msg = Enum.ERROR_LOGICTIC_CLIENT_CODE[code] || message;
    super(msg);
    this.className = 'LogisticsError';
  }
}

/**
 * Throw error if logistics client return code > 0
 *
 * @param res
 */
function handleResponse(res) {
  if (res[0].Code > 0) {
    throw new LogisticsError(res[0].Error, res[0].Code);
  }

  return res;
}

/**
 * Create routes
 *
 * @param task
 * @returns {Promise<void>}
 */
export async function createRoutes(task) {
  let request = task.type === Enum.JOB_TYPE.general ?
    new GeneralRequest(task):
    new MasterRequest(task);

  let res = await request.execLr();

  return handleResponse(res);
}

/**
 * Update routes partially
 *
 * @return {Promise<void>}
 * @param task
 */
export async function partialEditRoutes(task) {
  let request;

  if (task.type === Enum.JOB_TYPE.general) {
    request = new GeneralRequest(task);

  } else if (task.type === Enum.JOB_TYPE.master) {
    request = new MasterRequest(task);

  } else {
    throw new ValueError('Invalid job type value');
  }

  let res = await request.execLr();
  return handleResponse(res);
}

/**
 * Get status
 *
 * @param task
 * @param user
 * @returns {Promise<void>}
 */
export async function getStatus(task, user) {
  let request = new Request(task);
  let res = await request.getStatus();

  return handleResponse(res);
}

/**
 * Cancel job
 *
 * @param task
 * @param user
 * @returns {undefined}
 */
export async function cancel(task, user) {
  let request = new Request(task);
  let res = await request.cancel();

  return handleResponse(res);
}