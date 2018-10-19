import BaseRepository from '../repositories/BaseRepository';

const request = new BaseRepository();

function reSequence(data) {
  return request.put('/stop/changeSeq', data, {
    'Content-Type': 'application/json',
  });
}

function moveStop(jobId, fromPlanId, fromStops, toPlanId, toStops) {
  return request.put('/stop/move', {
    job_id: jobId,
    move_data: [
      {
        plan_id: fromPlanId,
        stops: fromStops.map((stopId, index) => ({
          client_stop_id: stopId,
          seq: index + 1,
        })),
      },
      {
        plan_id: toPlanId,
        stops: toStops.map((stopId, index) => ({
          client_stop_id: stopId,
          seq: index + 1,
        })),
      },
    ],
  }, {
    'Content-Type': 'application/json',
  });
}

function addUnserved(jobId, toPlanId, toStops, unserved) {
  return request.put('/stop/add-unserved', {
    job_id: jobId,
    plan_id: toPlanId,
    unserved,
    stops: toStops.map((stopId, index) => ({
      client_stop_id: stopId,
      seq: index + 1,
    })),
  }, {
    'Content-Type': 'application/json',
  });
}

function moveServedToNewRoute(jobId, fromPlanId, fromStops, vehicle, toStops) {
  return request.put('/stop/move-served-to-new-route', {
    job_id: jobId,
    move_data: [
      {
        plan_id: fromPlanId,
        stops: fromStops.map((stopId, index) => ({
          client_stop_id: stopId,
          seq: index + 1,
        })),
      },
      {
        plan_id: null,
        stops: toStops.map((stopId, index) => ({
          client_stop_id: stopId,
          seq: index + 1,
        })),
        vehicle,
      },
    ],
  }, {
    'Content-Type': 'application/json',
  });
}

function autoReRoute(jobId, planId) {
  return request.put('/stop/reset-seq', {
    job_id: jobId,
    plan_id: planId,
  });
}

const APIChangeRoute = {
  reSequence,
  moveStop,
  addUnserved,
  autoReRoute,
  moveServedToNewRoute,
};

export default APIChangeRoute;
