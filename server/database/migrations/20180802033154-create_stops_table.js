'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('stops', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT(20)
      },
      client_stop_id: {
        allowNull: false,
        type: Sequelize.STRING(45)
      },
      lat: {
        allowNull: false,
        type: Sequelize.DECIMAL(20, 8)
      },
      lng: {
        allowNull: false,
        type: Sequelize.DECIMAL(20, 8)
      },
      service_time: {
        type: Sequelize.INTEGER(11).UNSIGNED
      },
      time_start: {
        type: Sequelize.TIME
      },
      time_end: {
        type: Sequelize.TIME
      },
      volume: {
        type: Sequelize.FLOAT
      },
      weight: {
        type: Sequelize.FLOAT
      },
      dropoffs: {
        type: Sequelize.INTEGER(1),
        comment: 'set 1 to be dropoff, 0 to be pickup'
      },
      type: {
        type: Sequelize.STRING(45),
        comment: 'Motocycle: 1, Car: 2, Small Car: 4, Truck: 8'
      },
      seq: {
        type: Sequelize.INTEGER(11)
      },
      priority: {
        type: Sequelize.ENUM('high', '')
      },
      zone: {
        type: Sequelize.STRING
      },
      product_id: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      tel: {
        type: Sequelize.STRING
      },
      job_id: {
        type: Sequelize.BIGINT(20),
        references: { model: 'jobs', key: 'id' },
        onUpdate: 'restrict',
        onDelete: 'restrict'
      },
      client_vehicle_id: {
        type: Sequelize.STRING(45)
      },
      handled: {
        type: Sequelize.INTEGER(11)
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
    return queryInterface.dropTable('stops');
  }
};
