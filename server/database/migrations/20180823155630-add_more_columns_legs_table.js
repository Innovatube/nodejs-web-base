'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let col1 = queryInterface
      .addColumn(
        'legs',
        'service_time',
        {
          type: Sequelize.FLOAT
        }
      );

    let col2 = queryInterface
      .addColumn(
        'legs',
        'weight',
        {
          type: Sequelize.FLOAT
        }
      );

    return Promise.all([col1, col2]);
  },

  down: (queryInterface, Sequelize) => {
    let col1 = queryInterface
      .removeColumn(
        'legs',
        'service_time'
      );

    let col2 = queryInterface
      .removeColumn(
        'legs',
        'weight'
      );

    return Promise.all([col1, col2]);
  }
};
