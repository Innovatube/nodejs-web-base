import BaseRepository from '../repositories/BaseRepository';

const request = new BaseRepository();

const APIStop = {
  getStops({ jobId }) {
    return request.get('/stop', {
      job_id: jobId,
    });
  },
};

export default APIStop;
