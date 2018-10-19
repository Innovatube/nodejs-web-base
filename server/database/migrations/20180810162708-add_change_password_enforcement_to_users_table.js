'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users',
      'change_password_enforcement',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'users',
      'change_password_enforcement'
    );
  }
};
