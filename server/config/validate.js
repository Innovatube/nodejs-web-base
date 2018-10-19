import validateJs from 'validate.js';
import moment from 'moment';
import _ from 'lodash';
import {ValidationError} from '../errors';
import * as Helper from "../utils/helper";

/**
 * This override function `convertErrorMessages` in validate.js
 * @return {Array}
 */
validateJs.convertErrorMessages = function(errors, options) {
  options = options || {};
  const ret = [];
  const prettify = options.prettify || validateJs.prettify;
  errors.forEach(function(errorInfo) {
    let error = validateJs.result(errorInfo.error,
        errorInfo.value,
        errorInfo.attribute,
        errorInfo.options,
        errorInfo.attributes,
        errorInfo.globalOptions);

    if (!validateJs.isString(error)) {
      ret.push(errorInfo);
      return;
    }
    if (error[0] === '^') {
      error = error.slice(1);
    } else if (options.fullMessages !== false && errorInfo.options.fullMessages !== false) {
      error = validateJs.capitalize(prettify(errorInfo.attribute)) + " " + error;
    }
    error = error.replace(/\\\^/g, "^");
    error = validateJs.format(error, {
      value: validateJs.stringifyValue(errorInfo.value, options)
    });
    ret.push(validateJs.extend({}, errorInfo, {error: error}));
  });
  return ret;
};

validateJs.extend(validateJs.validators.datetime, {
  parse: function(value, options) {
    return +moment.utc(value);
  },
  format: function(value, options) {
    var format = options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm:ss";
    return moment.utc(value).format(format);
  }
});

validateJs.validators.timeConstraint = function(value, options, key, attributes) {
  const isIgnore = options.required === false && (value === undefined || value === null);
  if (isIgnore) {
    return;
  }

  try {
    Helper.parseTime(value)
  } catch (e) {
    return `is not a valid time`;
  }
};

/**
 * Validate stops key
 *
 * @param value
 * @param options
 * @param key
 * @param attributes
 * @return {string}
 */
validateJs.validators.stopsKeyConstraint = function(value, options, key, attributes) {
  if (!_.isArray(value)) {
    return 'stops must be array'
  }

  for (let stop of value) {
    if (!_.isNumber(stop.seq)) {
      return 'stop.seq must be number'
    }

    if (!stop.hasOwnProperty('client_stop_id')) {
      return 'stop.client_stop_id is required';
    }
  }
};

/**
 * Validate Repeat Period (days) by condition Change password enforcement
 * 
 * @param value
 * @param options
 * @param key
 * @param attributes
 * @return {string}
 */
validateJs.validators.repeatPeriod = function(value, options, key, attributes) {
  const { withKey, message } = options;
  if (attributes[withKey] && (attributes[withKey] === true || attributes[withKey] === 'true')) {
    if (isNaN(value) || Number(value) % 1 !== 0 || Number(value < 1)) {
      return message || 'Repeat period must number and more then 1';
    }
  }
};

/**
 * validation.
 *
 * @param  {object}  schema
 * @return {null|object}
 */
function validate(schema) {
  return function (req, res, next) {
    if (!schema) {
      return next();
    }
    const toValidate = {};
    _.forEach(req.body, (value, key) => {
      toValidate[key] = (typeof value === 'string') ? value.trim() : value;
    });
    const error = validateJs(toValidate, schema);
    if (error) {
      return next(new ValidationError('The given data was invalid', error));
    }
    return next();
  };
}

export default validate;
