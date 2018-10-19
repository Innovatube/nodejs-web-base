'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'tasks',
        'result',
        {
          type: Sequelize.TEXT('medium')
        }
      ),
      queryInterface.changeColumn(
        'tasks',
        'merged_result',
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
        'result',
        {
          type: Sequelize.TEXT
        }
      ),
      queryInterface.changeColumn(
        'tasks',
        'merged_result',
        {
          type: Sequelize.TEXT
        }
      )
    ]);
  }
};
