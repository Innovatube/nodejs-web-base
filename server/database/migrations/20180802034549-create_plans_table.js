'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('plans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT(20)
      },

      fleet_id: {
        allowNull: false,
        type: Sequelize.BIGINT(20),
        references: { model: 'fleets', key: 'id' },
        onUpdate: 'restrict',
        onDelete: 'restrict'
      },

      client_vehicle_id: {
        allowNull: false,
        type: Sequelize.STRING(45)
      },

      time_start: {
        type: Sequelize.DATE
      },

      time_end: {
        type: Sequelize.DATE
      },

      num_of_route: {
        type: Sequelize.INTEGER(11),
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
    return queryInterface.dropTable('plans');
  }
};
