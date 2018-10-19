'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const job = {
      id: 2,
      date_depart: '2018-06-05',
      use_toll: 0,
      use_time_routing_mode: 0,
      use_balance_vehicle_mode: 0,
      user_id: 1,
      file_id: 1
    };

    const stops = [
      {
        client_stop_id: 10032,
        lat: 13.5624353,
        lng: 100.773494,
        service_time: 20,
        time_start: '03:00:00',
        time_end: '23:00:00',
        volume: 1,
        weight: 0.163,
        dropoffs: 1,
        type: '2',
        zone: 'A',
        job_id: 2
      },
      {
        client_stop_id: 10068,
        lat: 13.812725,
        lng: 100.728818,
        service_time: 20,
        time_start: '03:00:00',
        time_end: '23:00:00',
        volume: 1,
        weight: 0.113,
        dropoffs: 1,
        type: '2',
        zone: 'A',
        job_id: 2
      },
      {
        client_stop_id: 10090,
        lat: 13.6262651,
        lng: 100.7245155,
        service_time: 20,
        time_start: '03:00:00',
        time_end: '23:00:00',
        volume: 1,
        weight: 0.164,
        dropoffs: 1,
        type: '2',
        zone: 'A',
        job_id: 2
      },
      {
        client_stop_id: 10218,
        lat: 13.669417,
        lng: 100.4060061,
        service_time: 20,
        time_start: '03:00:00',
        time_end: '23:00:00',
        volume: 1,
        weight: 0.164,
        dropoffs: 1,
        type: '2',
        priority: 'high',
        zone: 'A',
        job_id: 2
      },
      {
        client_stop_id: 111396,
        lat: 13.97326537,
        lng: 100.3964298,
        service_time: 20,
        time_start: '03:00:00',
        time_end: '23:00:00',
        volume: 1,
        weight: 0.164,
        dropoffs: 1,
        type: '2',
        priority: 'high',
        zone: 'A',
        job_id: 2
      }
    ];

    const vehicles = [
      {
        client_vehicle_id: 201,
        lat_start: 13.810052,
        lng_start: 100.566397,
        lat_end: 13.810052,
        lng_end: 100.566397,
        time_start: '08:00:00',
        time_end: '17:00:00',
        speed_limit: 80,
        break_time_start: '12:00:00',
        break_time_end: '13:00:00',
        volume: 200,
        weight: 1000,
        type: 2,
        job_id: 2
      },
      {
        client_vehicle_id: 202,
        lat_start: 13.810052,
        lng_start: 100.566397,
        lat_end: 13.810052,
        lng_end: 100.566397,
        time_start: '08:00:00',
        time_end: '17:00:00',
        speed_limit: 80,
        break_time_start: '12:00:00',
        break_time_end: '13:00:00',
        volume: 200,
        weight: 1000,
        type: 2,
        priority: 'high',
        job_id: 2
      }
    ];


    // return queryInterface.bulkInsert('vehicles', vehicles, {})
    return queryInterface.bulkInsert('jobs', [job], {})
      .then( result => {
        return Sequelize.Promise.all([
          queryInterface.bulkInsert('vehicles', vehicles, {}),
          queryInterface.bulkInsert('stops', stops, {})
        ]);
      })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
