import BaseRepository from '../repositories/BaseRepository';

const request = new BaseRepository();

const APIFleet = {
  getFleet({ jobId }) {
    return request.get('/fleet', {
      job_id: jobId,
    });
  },
};

export default APIFleet;
