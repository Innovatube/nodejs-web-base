'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn(
      'users',
      'repeat_period',
      'password_expired_days'
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn(
      'users',
      'password_expired_days',
      'repeat_period'
    );
  }
};
