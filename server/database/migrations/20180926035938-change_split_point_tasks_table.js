'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn(
      'tasks',
      'split_point',
      'split_points_raw'
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn(
      'tasks',
      'split_points_raw',
      'split_point'
    );
  }
};
