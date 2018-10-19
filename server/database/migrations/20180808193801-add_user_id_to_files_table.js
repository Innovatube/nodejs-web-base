'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'files',
      'user_id',
      {
        type: Sequelize.BIGINT(20),
        references: { model: 'users', key: 'id' },
        onUpdate: 'restrict',
        onDelete: 'restrict'
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'files',
      'user_id'
    );
  }
};
