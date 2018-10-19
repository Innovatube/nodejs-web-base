import BaseRepository from '../repositories/BaseRepository';

const request = new BaseRepository();


const adminApi = {
  login({ email, password }) {
    return request.post('/auth/login', {
      email,
      password,
    });
  },
  getAllUsers() {
    return request.get('/users');
  },
};

export default adminApi;
