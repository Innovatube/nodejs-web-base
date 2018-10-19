import BaseRepository from '../repositories/BaseRepository';

const request = new BaseRepository();

const profileApi = {
  getUserProfile() {
    return request.get('/user');
  },
  updateUserProfile(data) {
    return request.put('/user/change-password', data);
  },
  uploadAvatar(data) {
    return request.post('/user/change-avatar', data);
  },
};

export default profileApi;
