import validate from 'validate.js';

export default {
  storeUser: {
    first_name: {
      presence: true
    },
    last_name: {
      presence: true
    },
    email: {
      presence: {
        allowEmpty: false,
        message: 'email_cannot_be_blank',
        fullMessages: false,
      },
    },
    password: {
      presence: true,
    }
  },
  store: {
    name: {
      presence: {
        allowEmpty: false,
        message: 'name_cannot_be_blank',
        fullMessages: false,
      },
    },
    password: {
      presence: {
        allowEmpty: false,
        message: 'password_cannot_be_blank',
        fullMessages: false,
      },
    },
    email: {
      presence: {
        allowEmpty: false,
        message: 'email_cannot_be_blank',
        fullMessages: false,
      },
      email: {
        message: 'email_is_not_a_valid_email',
        fullMessages: false,
      },
    },
    company: {
      presence: {
        allowEmpty: false,
        message: 'company_cannot_be_blank',
        fullMessages: false,
      },
      length: {
        minimum: 1,
      },
    },
    is_admin: {
      presence: true
    },
    change_password_enforcement:{
      presence: true,
    },
    password_expired_days: {
      repeatPeriod: {
        withKey: 'change_password_enforcement',
        fullMessages: false,
        message: 'repeat_period_must_number_and_more_then_1',
      },
    }
  },
  update: {
    name: {
      presence: {
        message: 'full_name_cannot_be_blank',
        fullMessages: true,
      },
      length: {
        minimum: 1,
        fullMessages: false,
        message: 'full_name_cannot_be_blank',
      },
    },
    email: {
      presence: {
        message: 'email_cannot_be_blank',
        fullMessages: false,
      },
      email: {
        message: 'your_email_address_is_invalid',
        fullMessages: false,
      },
    },
    password: {
      presence: {
        allowEmpty: false,
        message: 'password_cannot_be_blank',
        fullMessages: false,
      },
    },
    company: {
      presence: {
        message: 'company_cannot_be_blank',
        fullMessages: false,
      },
      length: {
        minimum: 1,
        message: 'company_cannot_be_blank',
        fullMessages: false,
      },
    },
    is_admin: {
      presence: true
    },
    change_password_enforcement:{
      presence: true,
    },
  },

  updateUser: {
    email: {
      email: true
    }
  },

  login: {
    email: {
      presence: true,
      email: true
    },
    password: {
      presence: true
    }
  },
  forgotPassword: {
    email: {
      presence: true,
      email: true
    }
  },
  resetPasswordByToken: {
    token: {
      presence: true
    },
    password: {
      presence: true,
    },
    password_confirm: {
      equality: 'password'
    }
  },

  changePassword: {
    current_password: {
      presence: true,
    },
    new_password: {
      presence: true,
    },
    confirm_new_password: {
      equality: 'new_password'
    },
  },

  forceChangePassword: {
    password: {
      presence: true,
      length: {
        minimum: 1,
        message: 'password_cannot_be_blank',
        fullMessages: false,
      }
    },
    confirm_password: {
      equality: {
        attribute: "password",
        message: "confirm_password_is_not_equal_to_password",
        fullMessages: false,
      }
    },
  }
};
