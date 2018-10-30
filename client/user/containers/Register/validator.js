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
    errors.push(string.required('confirmPassword'));
  } else if (data.password !== data.confirmPassword) {
    errors.push(string.confirmPassword());
  }

  return errors;
};

export const validateConfirmPassword = (data) => {
  const errors = [];
  if (data.password !== data.cfpassword) {
    errors.push(string.required('confirmPassword'));
  } else if (data.password === data.cfpassword) {
    errors.push(string.confirmPassword());
  }

  return errors;
};

const validate = (data) => {
  const errors = {
    name: [],
    email: [],
    password: [],
    cfpassword: [],
  };

  errors.name = validateName(data.name);
  errors.email = validateEmail(data.email);
  if (data.password === data.cfpassword && data.password === '' && data.cfpassword === '') {
    errors.password = validatePassword(data.password);
    errors.cfpassword = validatePassword(data.cfpassword);
  } else if (data.password !== data.cfpassword) {
    errors.cfpassword = validateConfirmPassword(data.cfpassword);
  }

  return errors;
};


export default validate;
