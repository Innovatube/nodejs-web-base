'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'jobs',
      'status',
      {
        type: Sequelize.STRING,
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'jobs',
      'status'
    );
  }
};
