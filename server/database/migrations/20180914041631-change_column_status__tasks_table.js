'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'tasks',
      'status',
      {
        type: Sequelize.ENUM('init', 'running', 'partial_running', 'failed', 'success', 'cancelled'),
        defaultValue: 'init'
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'tasks',
      'status',
      {
        type: Sequelize.ENUM('init', 'running', 'partial_running', 'failed', 'success', 'cancel'),
        defaultValue: 'init'
      }
    );
  }
};
