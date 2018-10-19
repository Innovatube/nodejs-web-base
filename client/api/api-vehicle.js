import BaseRepository from '../repositories/BaseRepository';

const request = new BaseRepository();

const APIVehicle = {
  createVehicle(jobId, vehicle, stops) {
    return request.put('/vehicle', {
      job_id: jobId,
      vehicle,
      stops: stops.map((stopId, index) => ({
        client_stop_id: stopId,
        seq: index + 1,
      })),
    }, {
      'Content-Type': 'application/json',
    });
  },
  getVehicle({ jobId }) {
    return request.get('/vehicle', {
      job_id: jobId,
    });
  },
};

export default APIVehicle;
