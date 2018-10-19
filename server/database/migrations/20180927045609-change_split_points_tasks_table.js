'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'tasks',
      'split_points_raw',
      {
        type: Sequelize.TEXT
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn(
      'tasks',
      'split_points_raw',
      {
        type: Sequelize.STRING
      }
    );
  }
};
