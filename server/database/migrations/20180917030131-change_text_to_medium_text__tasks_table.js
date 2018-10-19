'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'tasks',
        'stops_raw',
        {
          type: Sequelize.TEXT('medium')
        }
      ),
      queryInterface.changeColumn(
        'tasks',
        'vehicles_raw',
        {
          type: Sequelize.TEXT('medium')
        }
      ),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'tasks',
        'stops_raw',
        {
          type: Sequelize.TEXT
        }
      ),
      queryInterface.changeColumn(
        'tasks',
        'vehcles_raw',
        {
          type: Sequelize.TEXT
        }
      )
    ]);
  }
};
