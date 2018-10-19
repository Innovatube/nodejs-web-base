'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'tasks',
      'finish_time_adjust_raw',
      {
        type: Sequelize.TEXT
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'tasks',
      'finish_time_adjust_raw'
    );
  }
};
