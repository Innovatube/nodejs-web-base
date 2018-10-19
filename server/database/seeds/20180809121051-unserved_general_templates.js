'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const job = {
      id: 4,
      date_depart: '2018-05-08',
      use_toll: 0,
      use_time_routing_mode: 0,
      use_balance_vehicle_mode: 0,
      load_factor: 1.0,
      user_id: 1,
      file_id: 1
    };

    const stops = [
      {
        client_stop_id: 'A',
        lat: 14.31959,
        lng: 100.61150,
        service_time: 20,
        time_start: '03:00:00',
        time_end: '23:00:00',
        volume: 1,
        weight: 30,
        dropoffs: 1,
        job_id: 4,
        type: 1
      },
      {
        client_stop_id: 'B',
        lat: 14.324675,
        lng: 100.59184,
        service_time: 20,
        time_start: '03:00:00',
        time_end: '23:00:00',
        volume: 1,
        weight: 30,
        dropoffs: 1,
        job_id: 4,
        type: 1
      },
      {
        client_stop_id: 'C',
        lat: 14.34263,
        lng: 100.58669,
        service_time: 20,
        time_start: '03:00:00',
        time_end: '23:00:00',
        volume: 1,
        weight: 30,
        dropoffs: 1,
        job_id: 4
      },
      {
        client_stop_id: 'D',
        lat: 14.33323,
        lng: 100.60137,
        service_time: 20,
        time_start: '03:00:00',
        time_end: '23:00:00',
        volume: 1,
        weight: 30,
        dropoffs: 1,
        job_id: 4
      },
      {
        client_stop_id: 'E',
        lat: 14.35394,
        lng: 100.62128,
        service_time: 20,
        time_start: '03:00:00',
        time_end: '23:00:00',
        volume: 1,
        weight: 30,
        dropoffs: 1,
        job_id: 4
      },
      {
        client_stop_id: 'F',
        lat: 14.33831,
        lng: 100.62463,
        service_time: 20,
        time_start: '03:00:00',
        time_end: '23:00:00',
        volume: 1,
        weight: 30,
        dropoffs: 1,
        job_id: 4
      },
      {
        client_stop_id: 'G',
        lat: 14.32957,
        lng: 100.63116,
        service_time: 20,
        time_start: '03:00:00',
        time_end: '23:00:00',
        volume: 1,
        weight: 30,
        dropoffs: 1,
        job_id: 4
      },
      {
        client_stop_id: 'H',
        lat: 14.34130,
        lng: 100.61940,
        service_time: 20,
        time_start: '03:00:00',
        time_end: '23:00:00',
        volume: 1,
        weight: 30,
        dropoffs: 1,
        job_id: 4
      },
      {
        client_stop_id: 'I',
        lat: 14.32700,
        lng: 100.61991,
        service_time: 20,
        time_start: '03:00:00',
        time_end: '23:00:00',
        volume: 1,
        weight: 30,
        dropoffs: 1,
        job_id: 4
      },
      {
        client_stop_id: 'J',
        lat: 14.35169,
        lng: 100.59966,
        service_time: 20,
        time_start: '03:00:00',
        time_end: '23:00:00',
        volume: 1,
        weight: 30,
        dropoffs: 1,
        job_id: 4
      },
      {
        client_stop_id: 'K',
        lat: 14.32966,
        lng: 100.62626,
        service_time: 20,
        time_start: '03:00:00',
        time_end: '23:00:00',
        volume: 1,
        weight: 30,
        dropoffs: 1,
        job_id: 4
      },
      {
        client_stop_id: 'L',
        lat: 14.35336,
        lng: 100.60335,
        service_time: 20,
        time_start: '03:00:00',
        time_end: '23:00:00',
        volume: 1,
        weight: 30,
        dropoffs: 1,
        job_id: 4
      }
    ];

    const vehicles = [
      {
        client_vehicle_id: 111,
        lat_start: 14.33673,
        lng_start: 100.6109,
        lat_end: 14.33673,
        lng_end: 100.6109,
        time_start: '08:00:00',
        time_end: '17:00:00',
        speed_limit: 80,
        break_time_start: '12:00:00',
        break_time_end: '13:00:00',
        volume: 200,
        weight: 1000,
        type: 2,
        job_id: 4
      },
      {
        client_vehicle_id: 112,
        lat_start: 14.33673,
        lng_start: 100.6109,
        lat_end: 14.33673,
        lng_end: 100.6109,
        time_start: '08:00:00',
        time_end: '17:00:00',
        speed_limit: 80,
        break_time_start: '12:00:00',
        break_time_end: '13:00:00',
        volume: 200,
        weight: 1000,
        type: 2,
        job_id: 4
      },
      {
        client_vehicle_id: 113,
        lat_start: 14.33673,
        lng_start: 100.6109,
        lat_end: 14.33673,
        lng_end: 100.6109,
        time_start: '08:00:00',
        time_end: '17:00:00',
        speed_limit: 80,
        break_time_start: '12:00:00',
        break_time_end: '13:00:00',
        volume: 200,
        weight: 1000,
        type: 2,
        job_id: 4
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
