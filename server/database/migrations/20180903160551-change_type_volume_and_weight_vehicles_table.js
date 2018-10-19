'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
     let weight = queryInterface.changeColumn(
      'vehicles',
      'weight',
      {
        type: Sequelize.FLOAT
      }
    );

    let volume = queryInterface.changeColumn(
      'vehicles',
      'volume',
      {
        type: Sequelize.FLOAT
      }
    );

    return Promise.all([weight, volume]);
  },

  down: (queryInterface, Sequelize) => {
    let weight = queryInterface.changeColumn(
      'vehicles',
      'weight',
      {
        type: Sequelize.INTEGER(11)
      }
    );

    let volume = queryInterface.changeColumn(
      'vehicles',
      'volume',
      {
        type: Sequelize.INTEGER(11)
      }
    );

    return Promise.all([weight, volume]);
  }
};
