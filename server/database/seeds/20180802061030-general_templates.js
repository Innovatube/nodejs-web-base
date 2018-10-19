'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const job = {
      id: 1,
      date_depart: '2017-07-01',
      use_toll: 0,
      use_time_routing_mode: 0,
      use_balance_vehicle_mode: 0,
      user_id: 1,
      file_id: 1
    };

    const stops = [
      {
        client_stop_id: 1,
        lat: 13.78754,
        lng: 100.601197,
        service_time: 30,
        time_start: '08:00:00',
        time_end: '17:00:00',
        volume: 30,
        weight: 20,
        dropoffs: 1,
        type: '2|4',
        zone: 'z1',
        job_id: 1
      },
      {
        client_stop_id: 2,
        lat: 13.789125,
        lng: 100.539919,
        service_time: 40,
        time_start: '08:00:00',
        time_end: '17:00:00',
        volume: 30,
        weight: 20,
        dropoffs: 1,
        type: '2',
        zone: 'z2',
        job_id: 1
      },
      {
        client_stop_id: 3,
        lat: 13.782633,
        lng: 100.526517,
        service_time: 50,
        time_start: '08:00:00',
        time_end: '17:00:00',
        volume: 30,
        weight: 20,
        dropoffs: 1,
        type: '2',
        zone: 'z1',
        job_id: 1
      },
      {
        client_stop_id: 4,
        lat: 13.80614,
        lng: 100.573501,
        service_time: 30,
        time_start: '08:00:00',
        time_end: '17:00:00',
        volume: 30,
        weight: 20,
        dropoffs: 2,
        type: '2',
        priority: 'high',
        zone: 'z1',
        job_id: 1
      },
      {
        client_stop_id: 5,
        lat: 13.874722,
        lng: 100.619819,
        service_time: 40,
        time_start: '08:00:00',
        time_end: '17:00:00',
        volume: 30,
        weight: 20,
        dropoffs: 2,
        type: '4',
        priority: 'high',
        zone: 'z2',
        job_id: 1
      },
      {
        client_stop_id: 6,
        lat: 13.829675,
        lng: 100.611622,
        service_time: 30,
        time_start: '08:00:00',
        time_end: '17:00:00',
        volume: 30,
        weight: 20,
        dropoffs: 2,
        type: '4',
        priority: '',
        zone: '',
        job_id: 1
      }
    ];

    const vehicles = [
      {
        client_vehicle_id: 1,
        lat_start: 13.8036917,
        lng_start: 100.5542416,
        lat_end: 13.8036917,
        lng_end: 100.5542416,
        time_start: '08:00:00',
        time_end: '17:00:00',
        speed_limit: 80,
        break_time_start: '12:00:00',
        break_time_end: '13:00:00',
        volume: 1000,
        weight: 1000,
        type: 4,
        priority: '',
        job_id: 1
      },
      {
        client_vehicle_id: 2,
        lat_start: 13.79518,
        lng_start: 100.61217,
        lat_end: 13.81042,
        lng_end: 100.65585,
        time_start: '08:00:00',
        time_end: '17:00:00',
        speed_limit: 40,
        break_time_start: '12:00:00',
        break_time_end: '13:00:00',
        volume: 1000,
        weight: 1000,
        type: 2,
        priority: '',
        job_id: 1
      },
      {
        client_vehicle_id: 3,
        lat_start: 13.810052,
        lng_start: 100.566397,
        lat_end: 13.810052,
        lng_end: 100.566397,
        time_start: '08:00:00',
        time_end: '5',
        speed_limit: 80,
        break_time_start: '12:00:00',
        break_time_end: '13:00:00',
        volume: 200,
        weight: 1000,
        type: 2,
        priority: '',
        job_id: 1
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
