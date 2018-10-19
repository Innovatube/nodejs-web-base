import BaseRepository from '../repositories/BaseRepository';

const request = new BaseRepository();

const displayApi = {

  getAllRoute(id) {
    return request.get('/fleet', {
      job_id: id,
    });
  },
};

export default displayApi;
