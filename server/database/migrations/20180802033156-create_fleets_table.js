'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('fleets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT(20)
      },
      job_id: {
        allowNull: false,
        type: Sequelize.BIGINT(20),
        references: { model: 'jobs', key: 'id' },
        onUpdate: 'restrict',
        onDelete: 'restrict'
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('success', 'uncomplete')
      },
      description: {
        type: Sequelize.STRING
      },
      total_wait_time: {
        type: Sequelize.FLOAT
      },
      total_eta: {
        type: Sequelize.FLOAT
      },
      total_time: {
        type: Sequelize.FLOAT
      },
      total_distance: {
        type: Sequelize.FLOAT
      },
      total_service_time: {
        type: Sequelize.FLOAT
      },
      total_toll_fee: {
        type: Sequelize.FLOAT
      },
      total_volume: {
        type: Sequelize.FLOAT
      },
      total_weight: {
        type: Sequelize.FLOAT
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
    return queryInterface.dropTable('fleets');
  }
};
