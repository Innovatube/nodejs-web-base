import * as Enum from '../config/enum';

export default {
  upload: {
    template_type: {
      presence: true,
      inclusion: {
        within: Object.values(Enum.JOB_TYPE),
        message: 'template type must in ' + Object.values(Enum.JOB_TYPE)
      }
    }
  },

  createJob: {
    file_id: {
      presence: true,
      numericality: {
        onlyInteger: true
      }
    },
    date_depart: {
      presence: true,
      datetime: {
        dateOnly: true
      }
    },
    use_toll: {
      presence: true,
      numericality: {
        onlyInteger: true
      }
    },
    use_time_routing_mode: {
      presence: true,
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 0,
        lessThanOrEqualTo: 1
      }
    },
    use_balance_vehicle_mode: {
      presence: true,
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 0,
        lessThanOrEqualTo: 4
      }
    },
    load_factor: {
      presence: false,
      numericality: true
    },
    distance_leg_limit: {
      presence: false,
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 1,
      }
    },
    leg_limit: {
      presence: false,
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 1,
      }
    }
  },

  createRoutes: {
    job_id: {
      presence: true,
      numericality: {
        onlyInteger: true
      }
    }
  },

  editRoutes: {
    job_id: {
      presence: true,
      numericality: {
        onlyInteger: true
      }
    }
  },

  getStatus: {
    task_id: {
      presence: true,
      numericality: {
        onlyInteger: true
      }
    }
  },

  cancelTask: {
    task_id: {
      presence: true,
      numericality: true
    }
  },
  reRoutes: {
    job_id: {
      presence: true,
      numericality: {
        onlyInteger: true
      }
    },
    date_depart: {
      datetime: {
        dateOnly: true
      }
    },
    use_toll: {
      numericality: {
        onlyInteger: true
      }
    },
    use_time_routing_mode: {
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 0,
        lessThanOrEqualTo: 1
      }
    },
    use_balance_vehicle_mode: {
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 0,
        lessThanOrEqualTo: 4
      }
    },
    load_factor: {
      numericality: {
        greaterThanOrEqualTo: 0,
        lessThanOrEqualTo: 1
      }
    },
    distance_leg_limit: {
      presence: false,
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 1,
      }
    },
    leg_limit: {
      presence: false,
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 1,
      }
    }
  }
};
