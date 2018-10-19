'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('exports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT(20)
      },
      file_id: {
        allowNull: false,
        type: Sequelize.BIGINT(20)
      },
      job_id: {
        allowNull: false,
        type: Sequelize.BIGINT(20)
      },
      user_id: {
        allowNull: false,
        type: Sequelize.BIGINT(20)
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING
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
    return queryInterface.dropTable('reports');
  }
};
