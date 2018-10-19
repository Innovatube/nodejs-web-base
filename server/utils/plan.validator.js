import validate from "validate.js";
import _ from "lodash";
import * as Helper from '../utils/helper';
import * as Enum from "../config/enum";

export default {
  create: {
    fleet_id: {
      presence: true,
      numericality: true
    },
    client_vehicle_id: {
      presence: true
    },
    vehicle_id: {
      presence: true,
      numericality: true
    }
  }
}
