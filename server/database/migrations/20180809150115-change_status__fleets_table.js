'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.changeColumn(
        'fleets',
        'status',
        {
          type: Sequelize.ENUM('success', 'uncompleted')
        }
      );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'fleets',
      'status',
      {
        type: Sequelize.ENUM('success', 'uncomplete')
      }
    );
  }
};
