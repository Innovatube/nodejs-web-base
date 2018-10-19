import * as Enum from "../config/enum";
import {moveUnServedToNewRoute} from "../controllers/v1/stop.controller";

export default {
  moveUnServedToNewRoute: {
    job_id: {
      presence: true,
      numericality: true
    },
    vehicle: {
      presence: true
    },
    "vehicle.lat_start": {
      presence: true,
      numericality: true
    },
    "vehicle.lng_start": {
      presence: true,
      numericality: true
    },
    "vehicle.lat_end": {
      presence: false,
      numericality: true
    },
    "vehicle.lng_end": {
      presence: false,
      numericality: true
    },
    "vehicle.time_start": {
      timeConstraint: {
        required: false
      }
    },
    "vehicle.time_end": {
      presence: false,
      timeConstraint: {
        required: false
      }
    },
    "vehicle.speed_limit": {
      presence: false,
      numericality: true
    },
    "vehicle.break_time_start": {
      presence: false,
      timeConstraint: {
        required: false
      }
    },
    "vehicle.break_time_end": {
      presence: false,
      timeConstraint: {
        required: false
      }
    },
    "vehicle.volume": {
      presence: false,
      numericality: true
    },
    "vehicle.weight": {
      presence: false,
      numericality: true
    },
    "vehicle.type": {
      presence: false,
      inclusion: {
        within: Object.values(Enum.VEHICLE_TYPE),
        message: 'vehicle.type must in ' + Object.values(Enum.VEHICLE_TYPE)
      }
    },
    "vehicle.priority": {
      presence: false,
      inclusion: {
        within: Object.values(Enum.PRIORITY),
        message: 'vehicle.priority must in ' + Object.values(Enum.PRIORITY)
      }
    },
    "vehicle.time_to_leave": {
      presence: false,
      numericality: true
    },
    "vehicle.reverse_delivery": {
      presence: false,
      numericality: true
    },
    stops: {
      presence: true,
      stopsKeyConstraint: true
    }
  }
}
