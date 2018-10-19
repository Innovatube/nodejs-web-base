'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('legs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT(20)
      },

      plan_id: {
        allowNull: false,
        type: Sequelize.BIGINT(20),
        references: { model: 'plans', key: 'id' },
        onUpdate: 'restrict',
        onDelete: 'restrict'
      },
      seq: {
        type: Sequelize.INTEGER(11)
      },
      start_id: {
        type: Sequelize.STRING(45)
      },

      stop_id: {
        type: Sequelize.STRING(45)
      },

      arrive_time: {
        type: Sequelize.DATE
      },

      finish_time: {
        type: Sequelize.DATE
      },

      wait_time: {
        type: Sequelize.INTEGER(11),
      },

      eta: {
        type: Sequelize.FLOAT
      },

      distance: {
        type: Sequelize.FLOAT
      },

      toll_fee: {
        type: Sequelize.FLOAT
      },

      volume: {
        type: Sequelize.FLOAT
      },

      route: {
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
    return queryInterface.dropTable('legs');
  }
};
