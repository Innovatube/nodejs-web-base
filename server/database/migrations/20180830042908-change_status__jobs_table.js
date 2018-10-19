'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.changeColumn(
      'jobs',
      'status',
      {
        type: Sequelize.ENUM('init', 'running', 'partial_running', 'completed'),
        defaultValue: 'init'
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'jobs',
      'status',
      {
        type: Sequelize.ENUM('init', 'running', 'completed'),
      }
    );
  }
};
