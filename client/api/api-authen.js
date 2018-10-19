let isAuthen = () => true;

export const apiAuthen = api => (...args) => {
  if (!isAuthen()) {
    return Promise.reject(new Error('Unauthorized api access'));
  }

  return api(...args);
};


export const apiAuthenConfig = {
  setAuthen(fn) {
    isAuthen = fn;
  },
};
