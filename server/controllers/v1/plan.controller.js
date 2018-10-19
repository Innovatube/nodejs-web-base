import * as VehicleService from '../../services/vehicle.service';
import * as JobService from '../../services/job.service';
import * as PlanService from '../../services/plan.service';
import * as FleetService from '../../services/fleet.service';
import {NotFound} from "../../../server_build/errors";

/**
 * API get list vehicles
 *
 * @param req
 * @param res
 * @return {Promise<*>}
 */
export async function create(req, res) {
  const body = req.body;

  /** @type {JobModel} */
  let job = await JobService.findById(body.job_id);
  if (!job) {
    throw new NotFound('Job is not found');
  }

  /** @type {VehicleModel} */
  let vehicle = await VehicleService
    .findByJobIdAndClientVehicleId(job.id, body.client_vehicle_id);

  if (!vehicle || vehicle.id !== parseInt(body.vehicle_id)) {
    throw new NotFound('Vehicle not found')
  }

  /** @type {FleetModel} */
  let fleet = await FleetService.findById(body.fleet_id);
  if (!fleet) {
    throw new NotFound('Vehicle not found')
  }

  const plan = await PlanService.save({
    fleet_id: fleet.id,
    client_vehicle_id: vehicle.client_vehicle_id,
    vehicle_id: vehicle.id
  });

  return res.json({
    error: false,
    data: {plan: plan}
  })
}