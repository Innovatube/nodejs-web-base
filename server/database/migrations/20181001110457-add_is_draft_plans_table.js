'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'plans',
      'is_draft',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'plans',
      'is_draft'
    );
  }
};
