'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface
        .addColumn(
          'fleets',
          'unserved',
          {
            type: Sequelize.TEXT
          }
        )
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface
        .removeColumn(
          'fleets',
          'unserved'
        )
  }
};
