import * as VehicleService from '../../services/vehicle.service';
import * as JobService from '../../services/job.service';
import {NotFound, ValidationError} from "../../errors";


/**
 * API get list vehicles
 *
 * @param req
 * @param res
 * @return {Promise<*>}
 */
export async function list(req, res) {
  let jobId = req.query.job_id;

  if (!jobId) {
    throw new ValidationError('job_id is required', {
      job_id: ['job_id is required']
    })
  }

  let job = await JobService.findOwnJob(jobId, req.currentUser.id);
  if (!job) {
    throw new NotFound('Job is not found');
  }

  let vehicles = await VehicleService.findByJobId(jobId);

  return res.json({
    error: false,
    data: {vehicles: vehicles}
  })
}

