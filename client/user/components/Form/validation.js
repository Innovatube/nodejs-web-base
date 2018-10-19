import _ from 'lodash';
import moment from 'moment';
import convert from 'string-template';

const required = t => (field, title) => (data) => {
  if (data && data[field]) {
    return true;
  }

  return convert(t('cannot_be_blank'), { title });
};

const vehicleIDUnique = t => (field, currents) => (data) => {
  if (!data[field] || currents.every(current => current !== data[field])) {
    return true;
  }

  return convert(t('route_id_exist'), { data: data[field] });
};

const isIn = t => (field, title, options) => (data) => {
  if (!data || !data[field] || options.some(option => option === data[field])) {
    return true;
  }

  return convert(t('must_in'), { title, value: JSON.stringify(options) });
};

const number = t => (field, title) => (data) => {
  if (!data || !data[field] || !_.isNaN(+data[field])) {
    return true;
  }

  return convert(t('is_not_a_number'), { title });
};

const isDateFormat = t => (field, title, format) => (data) => {
  if (!data || !data[field] || moment(data[field], format, true).isValid()) {
    return true;
  }

  return convert(t('wrong_format'), { title, format });
};

const validate = validators => data => validators
  .map(validator => validator(data))
  .filter(result => result !== true);

const isValidated = validators => data => validate(validators)(data).length === 0;

const Validator = {
  required,
  isIn,
  vehicleIDUnique,
  number,
  isDateFormat,

  validate,
  isValidated,
};

export default Validator;
