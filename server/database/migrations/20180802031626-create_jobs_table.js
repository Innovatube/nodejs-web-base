'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('jobs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT(20)
      },
      date_depart: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      use_toll: {
        allowNull: false,
        type: Sequelize.INTEGER(1)
      },
      use_time_routing_mode: {
        allowNull: false,
        type: Sequelize.INTEGER(1)
      },
      use_balance_vehicle_mode: {
        allowNull: false,
        type: Sequelize.INTEGER(1)
      },
      load_factor: {
        type: Sequelize.FLOAT
      },
      use_system_zone: {
        type: Sequelize.INTEGER(1)
      },
      balance_by: {
        type: Sequelize.INTEGER(11)
      },
      distance_leg_limit: {
        type: Sequelize.INTEGER(11)
      },
      leg_limit: {
        type: Sequelize.INTEGER(11)
      },
      space_offset: {
        type: Sequelize.INTEGER(11)
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM('master', 'general'),
        defaultValue: 'general'
      },
      user_id: {
        allowNull: false,
        type: Sequelize.BIGINT(20),
        references: { model: 'users', key: 'id' },
        onUpdate: 'restrict',
        onDelete: 'restrict'
      },
      file_id: {
        allowNull: false,
        type: Sequelize.BIGINT(20)
      },
      long_running_job_id: {
        type: Sequelize.BIGINT(20)
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
    }).then(() => {
      queryInterface.addIndex('jobs', ['file_id']);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('jobs');
  }
};
