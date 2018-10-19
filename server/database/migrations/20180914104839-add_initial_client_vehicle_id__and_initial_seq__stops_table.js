'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'stops',
        'initial_client_vehicle_id',
        {
          type: Sequelize.STRING(45)
        }
      ),
      queryInterface.addColumn(
        'stops',
        'initial_seq',
        {
          type: Sequelize.STRING(45)
        }
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn(
        'stops',
        'initial_client_vehicle_id',
        {
          type: Sequelize.STRING(45)
        }
      ),
      queryInterface.removeColumn(
        'stops',
        'initial_seq',
        {
          type: Sequelize.STRING(45)
        }
      )
    ]);
  }
};
