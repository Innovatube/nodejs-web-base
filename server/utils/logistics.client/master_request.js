import Request from "./request";
import rp from "request-promise";
import logger from "../../config/winston";

/**
 * Long running task
 */
export default class MasterRequest extends Request {

  getCommonFields() {
    return ['date_depart', 'use_toll', 'use_time_routing_mode', 'use_balance_vehicle_mode',
      'load_factor', 'use_constraints'];
  }

  getStopFields() {
    return ['client_stop_id', 'lat', 'lng', 'service_time', 'time_start',
      'time_end', 'volume', 'weight', 'dropoffs', 'type', 'seq', 'client_vehicle_id'];
  }

  getVehicleFields() {
    return ['client_vehicle_id', 'lat_start', 'lng_start',
      'lat_end', 'lng_end', 'time_start', 'time_end', 'speed_limit', 'break_time_start', 'break_time_end',
      'volume', 'weight', 'type', 'priority'];
  }

  /**
   *
   * @returns {Promise<void>}
   */
  async exec() {
    let formData = await this.getFormData();
    let url = Request.getAPIUrl() + 'fvrp/1.0.0';
    let options = this.getOptions(url, formData);

    logger.info(`Sent to API: ${url}, Post data: ${JSON.stringify(formData)}`);

    let res = await rp(options);
    logger.info(`Response: ${JSON.stringify(res)}`);

    return res
  }

  /**
   *
   * @returns {Promise<void>}
   */
  async execLr() {
    let formData = await this.getFormData();
    let url = Request.getAPIUrl() + 'fvrp_lr/1.0.0';
    let options = await this.getOptions(url, formData);

    logger.info(`Sent to API: ${url}, Post data: ${JSON.stringify(formData)}`);

    let res = await rp(options);
    logger.info(`Response: ${JSON.stringify(res)}`);

    return res
  }
}