import concat from 'lodash.concat';
import isFunction from 'lodash.isfunction';
import isObject from 'lodash.isobject';
import moment from 'moment';
import string from './string';

export function email(data) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const result = re.test(String(data).toLowerCase());
  if (result === true) {
    return true;
  }

  return string.email;
}

export const max = length => (value) => {
  if (!value || value.length <= length) {
    return true;
  }

  return string.max(length);
};

export const min = length => (value) => {
  if (!value || value.length >= length) {
    return true;
  }

  return string.min(length);
};

export const required = (value) => {
  if (value && value.length > 0) {
    return true;
  }

  return string.required;
};

export const isNumber = (value) => {
  if (!isNaN(value)) {
    return true;
  }

  return string.isNumber;
};

export const isPast = (value) => {
  const duration = moment().diff(moment(value), 'days', true);
  if (duration >= 1) {
    return true;
  }

  return string.isPast;
};


export default function validate(value, format) {
  if (format === undefined || value === undefined) {
    return [];
  }
  if (isObject(value)) {
    const validateKeys = Object.keys(value).filter(key => format[key] !== undefined);

    return validateKeys.reduce((results, key) => concat(results, validate(value[key], format[key])), []);
  }
  let results = [];
  if (isFunction(format)) {
    results.push(format());
  } else {
    if (format.validations) {
      results = format.validations.map(validator => validator(value));
    }
    if (format.email && value.length > 0) {
      results.push(email(value));
    }

    if (format.max && value.length) {
      results.push(max(format.max)(value));
    }

    if (format.min && value.length) {
      results.push(min(format.min)(value));
    }

    if (format.required && required(value) !== true) {
      results.push(required(value));
    }

    if (format.isPast && value && value.length > 0) {
      results.push(isPast(value));
    }
  }

  if (format.number && value.length && isNumber(value) !== true) {
    results.push(isNumber(value));
  }

  return results.filter(result => result !== true).map(result => result(format.label));
}
