import * as JobService from '../../services/job.service';
import { NotFound, ValidationError} from "../../errors";
import * as Helper from "../../utils/helper";

export async function update(req, res) {
  const currentUser = req.currentUser;
  let jobId = req.params.id;
  const body = req.body;

  let job = await JobService.findOne({
    where: {id: jobId, user_id: currentUser.id}
  });

  if (!job) {
    throw new NotFound('Cannot find job');
  }

  let jobObj = {};
  jobObj = Helper.copyProperties(body, jobObj, [
    'date_depart',
    'use_toll',
    'use_time_routing_mode',
    'use_balance_vehicle_mode',
    'load_factor',
    'distance_leg_limit',
    'leg_limit',
    'use_constraints',
    'use_system_zone',
    'balance_by'
  ]);

  await JobService.update(jobObj, {
    where: {id: jobId}
  });

  job = await job.reload();

  return res.json({
    error: false,
    data: {job: job}
  });
}


/**
 * API get list vehicles
 *
 * @param req
 * @param res
 * @return {Promise<*>}
 */
export async function show(req, res) {
  let jobId = req.params.id;
  let currentUser = req.currentUser;

  if (!jobId) {
    throw new ValidationError('job_id is required', {
      job_id: ['job_id is required']
    })
  }

  let job = await JobService.findOne({
    where: {id: jobId, user_id: currentUser.id}
  });

  if (!job) {
    throw new NotFound('Job is not found');
  }

  return res.json({
    error: false,
    data: {job: job}
  })
}