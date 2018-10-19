'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'stops',
      'plan_id',
      {
        type: Sequelize.BIGINT(20),
        references: { model: 'plans', key: 'id' },
        onUpdate: 'restrict',
        onDelete: 'restrict'
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'stops',
      'plan_id'
    );
  }
};
