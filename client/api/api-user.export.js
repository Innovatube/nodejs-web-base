import BaseRepository from '../repositories/BaseRepository';

const request = new BaseRepository();
const exportApi = {
  exportReport(id, name) {
    return request.download(`/logistics/download-report/${id}`, name);
  },

  exportMasterPlan(id, name) {
    return request.download(`/logistics/download-export-master-plan/${id}`, name);
  },
};

export default exportApi;
