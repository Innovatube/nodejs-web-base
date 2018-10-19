import BaseRepository from '../repositories/BaseRepository';

const request = new BaseRepository();

const jobApi = {
  show(id) {
    return request.get(`/job/${id}`);
  },
  update(jobId,
    dateDepart,
    useToll,
    useTimeRoutingMode,
    useBalanceVehicleMode,
    loadFactor,
    distanceLegLimit,
    legLimit,
    useConstraints,
    useSystemZone,
    type) {
    const postReRoutes = {
      job_id: jobId,
      date_depart: dateDepart,
      use_toll: useToll,
      use_time_routing_mode: useTimeRoutingMode,
      use_balance_vehicle_mode: useBalanceVehicleMode,
      load_factor: loadFactor,
    };
    if (useSystemZone) {
      postReRoutes.use_system_zone = useSystemZone;
    }
    if (type === 'general') {
      if (distanceLegLimit !== '') {
        postReRoutes.distance_leg_limit = distanceLegLimit;
      }
      if (legLimit !== '') {
        postReRoutes.leg_limit = legLimit;
      }
    } else if (type === 'master') {
      postReRoutes.use_constraints = useConstraints ? 1 : 0;
    }

    return request.put(`/logistics/re-routes`, postReRoutes);
  },
};

export default jobApi;
