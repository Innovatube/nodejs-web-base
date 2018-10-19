'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'tasks',
      'action',
      {
        type: Sequelize.STRING(45),
        allowNull: false
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'tasks',
      'action'
    );
  }
};
