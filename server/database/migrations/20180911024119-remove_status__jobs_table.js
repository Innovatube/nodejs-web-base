'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('jobs','long_running_job_id'),
      queryInterface.removeColumn('jobs', 'status')
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'jobs',
        'long_running_job_id',
        {
          type: Sequelize.BIGINT(20)
        }
      ),
      queryInterface.addColumn(
        'jobs',
        'status',
        {
          type: Sequelize.ENUM('init', 'running', 'completed'),
          defaultValue: 'init'
        }
      )
    ])
  }
};
