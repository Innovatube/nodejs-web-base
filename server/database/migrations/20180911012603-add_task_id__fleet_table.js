'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let removeColumn = queryInterface.removeColumn(
      'fleets',
      'long_running_job_id'
    );

    let addColumn = queryInterface.addColumn(
      'fleets',
      'task_id',
      {
        type: Sequelize.BIGINT(20),
        references: { model: 'tasks', key: 'id' },
        onUpdate: 'restrict',
        onDelete: 'restrict'
      }
    );

    return Promise.all([removeColumn, addColumn]);
  },

  down: (queryInterface, Sequelize) => {
    let removeColumn = queryInterface.removeColumn(
      'fleets',
      'task_id'
    );

    let addColumn = queryInterface.addColumn(
      'fleets',
      'long_running_job_id',
      {
        type: Sequelize.BIGINT(20)
      }
    );

    return Promise.all([removeColumn, addColumn]);
  }
};
