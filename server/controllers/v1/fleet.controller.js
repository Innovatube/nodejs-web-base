import {BadRequest, LogicError, NotFound} from "../../errors";
import * as FleetService from '../../services/fleet.service';
import * as JobService from '../../services/job.service';
import rp from "request-promise";

/**
 *  Get fleet and its association
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function getFleet(req, res) {
  let params = req.query;
  let currentUser = req.currentUser;

  if (!params.job_id) {
    throw new BadRequest('Must provide job_id');
  }

  let job = await JobService.findOwnJob(params.job_id, currentUser.id);
  if (!job) {
    throw new NotFound('Job not found');
  }

  let currentFleet = await JobService.getLastFleet(job.id);
  if (!currentFleet) {
    throw new Error(`Fleet not found for job id ${job.id}`);
  }

  let fleet = await FleetService.getFullById(currentFleet.id);

  return res.json({
    error: false,
    data: {fleet: fleet}
  });
}