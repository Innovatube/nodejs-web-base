'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('vehicles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT(20)
      },
      client_vehicle_id: {
        allowNull: false,
        type: Sequelize.STRING(45)
      },
      lat_start: {
        allowNull: false,
        type: Sequelize.DECIMAL(20, 8)
      },
      lng_start: {
        allowNull: false,
        type: Sequelize.DECIMAL(20, 8)
      },
      lat_end: {
        type: Sequelize.DECIMAL(20, 8)
      },
      lng_end: {
        type: Sequelize.DECIMAL(20, 8)
      },
      time_start: {
        type: Sequelize.TIME
      },
      time_end: {
        type: Sequelize.TIME
      },
      speed_limit: {
        type: Sequelize.INTEGER.UNSIGNED
      },
      break_time_start: {
        type: Sequelize.TIME
      },
      break_time_end: {
        type: Sequelize.TIME
      },
      volume: {
        type: Sequelize.INTEGER(11)
      },
      weight: {
        type: Sequelize.INTEGER(11)
      },
      type: {
        type: Sequelize.INTEGER(11)
      },
      priority: {
        type: Sequelize.ENUM('high', '')
      },
      time_to_leave: {
        type: Sequelize.INTEGER(11)
      },
      reverse_delivery: {
        type: Sequelize.INTEGER(11)
      },
      job_id: {
        type: Sequelize.BIGINT(20),
        references: { model: 'jobs', key: 'id' },
        onUpdate: 'restrict',
        onDelete: 'restrict'
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
    return queryInterface.dropTable('vehicles');
  }
};
