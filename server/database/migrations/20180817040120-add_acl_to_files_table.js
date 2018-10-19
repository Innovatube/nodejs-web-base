'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'files',
      'acl',
      {
        type: Sequelize.STRING,
        defaultValue: 'public'
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'files',
      'acl'
    );
  }
};
