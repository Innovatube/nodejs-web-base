import logger from "../../config/winston";
import rp from "request-promise";

export default class Request {
  constructor(task) {
    if (!task) {
      throw new Error('Must provide task')
    }

    this.task = task;
    this.common = task.common;
    this.stops = task.stops;
    this.vehicles = task.vehicles;
    this.user = task.authorize_user;
  }

  async exec() {
    throw new Error('Not Implemented');
  }

  async execLr() {
    throw new Error('Not Implemented');
  }

  static getAPIUrl() {
    return process.env.NEXTY_API_URL;
  }

  /**
   * Get status
   *
   * @returns {Promise<void>}
   */
  async getStatus() {
    if (!this.task.long_running_id) {
      throw new Error('Cannot get the status, because there is no long_running_id');
    }

    let formData = {
      job_id: this.task.long_running_id,
      user: this.user
    };

    let url = Request.getAPIUrl() + 'mvrp_status/1.0.0';
    let options = this.getOptions(url, formData);
    logger.info(`Sent to API: ${url}, Post data: ${JSON.stringify(formData)}`);

    let res = await rp(options);
    logger.info(`Response: ${JSON.stringify(res)}`);

    return res
  }

  /**
   * Cancel task
   *
   * @returns {Promise<void>}
   */
  async cancel() {
    if (!this.task.long_running_id) {
      throw new Error('Cannot canncel task, because there is no long_running_id');
    }

    let formData = {
      job_id: this.task.long_running_id,
      user: this.user
    };

    let url = Request.getAPIUrl() + 'mvrp_cancel/1.0.0';
    let options = this.getOptions(url, formData);
    logger.info(`Sent to API: ${url}, Post data: ${JSON.stringify(formData)}`);
    let res = await rp(options);
    logger.info(`Response: ${JSON.stringify(res)}`);

    return res
  }
  /**
   * Format params that send to nexty
   */
  async formatParams() {
    return {
      commons: this.formatCommon(this.common),
      stops: this.formatStops(this.stops),
      vehicles: this.formatVehicles(this.vehicles)
    }
  }

  /**
   * input:  >>> [[a, b, c], [x, y, z]]
   * output: >>>
   *            a, b, c\n
   *            x, y, z
   */
  toStringParams(data) {
    let result = data.map(params => {
      return params.join().replace(/,*$/, '');
    });

    return result.join('\n');
  };

  getCommonFields() {
    throw new Error('Must implement');
  }

  /**
   *
   * @param common
   */
  formatCommon(common) {
    const fields = this.getCommonFields();
    let params = [];

    fields.forEach(field => {
      if (common[field] === undefined) {
        throw new Error('Format fields error, there is no such field: ' + field)
      }

      if (common[field] != null) {
        params.push(common[field]);
      } else {
        params.push('');
      }
    });

    return params.join().replace(/,*$/, '');
  }

  getStopFields() {
    throw new Error('Must implement');
  }

  /**
   * Convert stops to Nexty params
   *
   * @param stops
   */
  formatStops(stops) {
    const fields = this.getStopFields();
    let stopsParams = [];

    stops.forEach(stop => {
      let stopParams = [];

      fields.forEach(field => {
        if (stop[field] === undefined) {
          throw new Error('Format fields error, there is no such field: ' + field)
        }

        if (stop[field] != null) {
          stopParams.push(stop[field]);
        } else {
          stopParams.push('');
        }
      });

      stopsParams.push(stopParams);
    });

    return this.toStringParams(stopsParams);
  }

  getVehicleFields() {
    throw new Error('Must implement `getVehicleFields`');
  }

  /**
   * Convert vehicles to nexty params
   *
   * @param {object} vehicles
   */
  formatVehicles(vehicles) {
    const fields = this.getVehicleFields();

    let vehiclesParams = [];

    vehicles.forEach(vehicle => {
      let vehicleParams = [];

      fields.forEach(field => {
        if (vehicle[field] === undefined) {
          throw new Error('Format fields error, there is no such field: ' + field)
        }

        if (vehicle[field] != null) {
          vehicleParams.push(vehicle[field]);
        } else {
          vehicleParams.push('');
        }
      });
      vehiclesParams.push(vehicleParams);
    });

    return this.toStringParams(vehiclesParams);
  }

  /**
   * Get form data for mvrp and fvrp
   *
   * @return {Promise<{commons: *, stops: *, vehicles: *, user: string}>}
   */
  async getFormData() {
    let formatParams = await this.formatParams();

    return {
      commons: formatParams.commons,
      stops: formatParams.stops,
      vehicles: formatParams.vehicles,
      user: this.user
    };
  }

  /**
   * Options for POST request, with content-type url-encoded
   *
   * @param {string} uri
   * @param {object} data
   * @returns {Promise<{uri: *, method: string, headers: {Authorization: string}, form: *}>}
   */
  getOptions(uri, data) {
    return {
      uri: uri,
      method: 'post',
      headers: {
        'Authorization': process.env.NEXTY_ACCESS_TOKEN
      },
      form: data,
      json:true
    };
  }
}