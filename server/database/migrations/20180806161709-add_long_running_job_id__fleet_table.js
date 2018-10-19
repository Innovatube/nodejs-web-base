'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn(
      'fleets',
      'long_running_job_id',
      {
        type: Sequelize.BIGINT(20)
      }
    );

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'fleets',
      'long_running_job_id'
    );
  }
};
