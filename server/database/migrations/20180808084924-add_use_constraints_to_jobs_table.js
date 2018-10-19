'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'jobs',
      'use_constraints',
      {
        type: Sequelize.INTEGER(11)
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'jobs',
      'use_constraints'
    );
  }
};
