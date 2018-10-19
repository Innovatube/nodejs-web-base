'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'stops',
      'historical_client_vehicle_id_raw',
      {
        type: Sequelize.TEXT
      }
    );
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn(
        'stops',
        'historical_client_vehicle_id_raw'
      );
  }
};
