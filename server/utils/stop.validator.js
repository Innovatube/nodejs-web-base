import validate from 'validate.js';
import _ from "lodash";

export default {
  changeSeq: {
    job_id: {
      presence: true,
      numericality: true
    },
    plan_id: {
      presence: true,
      numericality: true
    },
    stops: {
      stopsKeyConstraint: {
        fullMessages: false,
      }
    }
  },

  resetSeq: {
    job_id: {
      presence: true,
      numericality: true
    },
    plan_id: {
      presence: true
    }
  },

  moveServedToExistRoute: {
    job_id: {
      presence: true,
      numericality: true
    },
    move_data: {
      moveDataKeyConstraint: true
    }
  },
  moveUnServedToExistRoute: {
    job_id: {
      presence: true,
      numericality: true
    },
    plan_id: {
      presence: true,
      numericality: true
    },
    unserved: {
      presence: true,
    },
    stops: {
      stopsKeyConstraint: {
        fullMessages: false,
      }
    }
  },
  moveServeToNewRoute: {
    job_id: {
      presence: true,
      numericality: true
    },
    move_data: {
      moveDataKeyConstraint: true
    }
  }
}

/**
 * Validate key move_data of move stop API
 *
 * @param value
 * @return {string}
 */
validate.validators.moveDataKeyConstraint = function(value) {
  if (!_.isArray(value)) {
    return 'move_data must be array';
  }

  if (value.length !== 2) {
    return 'Please specify 2 sequences';
  }

  for (let data of value) {
    if (!data.hasOwnProperty('plan_id')) {
      return 'move_data[].plan_id is required';
    }

    if (!data.hasOwnProperty('stops')) {
      return 'move_data[].stops is required';
    }

    let stops = data.stops;
    for (let stop of stops) {
      if (!_.isNumber(stop.seq)) {
        return 'move_data[].stops[].seq must be number';
      }

      if (!stop.hasOwnProperty('client_stop_id')) {
        return 'move_data[].stops[].client_stop_id is required';
      }
    }
  }

  if (value[0].plan_id === value[1].plan_id) {
    return 'move_data[0].plan_id must not equals to move_data[1].plan_id';
  }
};