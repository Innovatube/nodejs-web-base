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

export const validatePassword = (password) => {
  const errors = [];
  if (password.length === 0) {
    errors.push(string.required('password'));
  }

  return errors;
};

export const validateResetPassword = (data) => {
  const errors = [];
  if (data.password.length === 0 || data.confirmPassword.length === 0) {
    errors.push(string.required('password'));
  } else if (data.password !== data.confirmPassword) {
    errors.push(string.confirmPassword());
  }

  return errors;
};

const validate = (data) => {
  const errors = {
    email: [],
    password: [],
  };

  errors.email = validateEmail(data.email);
  errors.password = validatePassword(data.password);

  return errors;
};


export default validate;
