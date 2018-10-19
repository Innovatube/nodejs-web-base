'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT(20)
      },
      job_id: {
        type: Sequelize.BIGINT(20),
        references: { model: 'jobs', key: 'id' },
        onUpdate: 'restrict',
        onDelete: 'restrict'
      },
      check_points_raw: {
        type: Sequelize.STRING
      },
      common_raw: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      stops_raw: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      vehicles_raw: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      authorize_user: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('general', 'master'),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('init', 'running', 'partial_running', 'failed', 'success', 'cancel'),
        defaultValue: 'init'
      },
      long_running_id: {
        type: Sequelize.BIGINT(20)
      },
      response: {
        type: Sequelize.TEXT
      },
      result: {
        type: Sequelize.TEXT
      },
      trace_back: {
        type: Sequelize.TEXT
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("tasks");
  }
};
