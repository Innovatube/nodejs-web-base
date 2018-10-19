import string from '../../components/Input/string';

export const validateEmail = (email) => {
  const errors = [];
  if (email.length === 0) {
    errors.push(string.required('email'));
  } else {
    const regexPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const result = regexPattern.test(String(email).toLowerCase());
    if (result !== true) {
      errors.push(string.email());
    }
  }

  return errors;
};

export const validateName = (name) => {
  const errors = [];
  if (name.length === 0) {
    errors.push(string.required('name'));
  }

  return errors;
};

export const validatePassword = (type, data) => {
  const errors = [];
  switch (type) {
    case 'currentPassword':
      if (data.currentPassword.length === 0) {
        errors.push(string.required('currentPassword'));
      }

      return errors;

    case 'newPassword':
      if (data.newPassword.length === 0) {
        errors.push(string.required('newPassword'));
      }

      return errors;
    case 'confirmPassword':
      if (data.confirmPassword.length === 0) {
        errors.push(string.required('confirmPassword'));
      } else if (data.newPassword !== data.confirmPassword) {
        errors.push(string.confirmPassword());
      }

      return errors;
    default:
      return errors;
  }
};

const validate = (data) => {
  const errors = {};

  Object.keys(data).map((item) => {
    errors[item] = validatePassword(item, data);

    return item;
  });

  return errors;
};


export default validate;
