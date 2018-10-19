'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'plans',
      'vehicle_id',
      {
        type: Sequelize.BIGINT(20),
        references: { model: 'vehicles', key: 'id' },
        onUpdate: 'restrict',
        onDelete: 'restrict'
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'plans',
      'vehicle_id'
    );
  }
};
