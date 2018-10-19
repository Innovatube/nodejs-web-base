'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'plans',
      'duplicate_of',
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
      'plans',
      'duplicate_of'
    );
  }
};
