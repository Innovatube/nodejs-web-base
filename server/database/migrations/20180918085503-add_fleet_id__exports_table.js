'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'exports',
      'fleet_id',
      {
        allowNull: false,
        type: Sequelize.BIGINT(20),
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'exports',
      'fleet_id'
    );
  }
};
