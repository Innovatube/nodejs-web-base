import BaseRepository from '../repositories/BaseRepository';

const request = new BaseRepository();


const APIImport = {
  upload(data) {
    return request.post('/logistics/upload', data);
  },
  submitRoute(data) {
    return request.post('/logistics/create-job', data);
  },
  createRoutes(data) {
    return request.post('/logistics/create-routes', data);
  },
  checkStatusProgress({ taskId }) {
    return request.post('/logistics/get-status', {
      task_id: taskId,
    });
  },
  cancelSubmitRoute(data) {
    return request.post('/logistics/cancel-task', data);
  },
};

export default APIImport;
