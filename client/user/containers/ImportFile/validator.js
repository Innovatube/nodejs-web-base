
const validateDataByType = (type, data) => {
  const errors = [];
  switch (type) {
    case 'date':
      if (!data.date || data.date.length === 0) {
        errors.push('date_can_not_be_empty');
      }

      return errors;
    default:
      return errors;
  }
};


const validateInput = (data) => {
  const errors = {};
  Object.keys(data).map((key) => {
    errors[key] = validateDataByType(key, data);

    return key;
  });

  return errors;
};

export const mapApiFieldsToState = (key) => {
  switch (key) {
    case 'distance_leg_limit':
      return 'dropToDrop';
    case 'leg_limit':
      return 'vehicleLimit';
    case 'date_depart':
      return 'date';
    default:
      return '';
  }
};

export default validateInput;
