import BaseRepository from '../repositories/BaseRepository';

const request = new BaseRepository();

const authApi = {
  login({ email, password }) {
    return request.post('/auth/login', {
      email,
      password,
    });
  },
  create({
    name,
    email,
    password,
    cfpassword,
  }) {
    return request.post('/auth/create', {
      name,
      email,
      password,
      cfpassword,
    });
  },
  forgotPassword(email) {
    return request.post('/auth/forgot-password', {
      email,
    });
  },
  verifyToken(token) {
    return request.get(`/auth/reset/password`, {
      token,
    });
  },
  resetPassword(data) {
    return request.post('/auth/reset/password', data);
  },
  forceChangePassword(data) {
    return request.put('/user/force-change-password', data);
  },
};

export default authApi;
