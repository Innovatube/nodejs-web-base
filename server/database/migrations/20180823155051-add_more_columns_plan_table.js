'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let addPercentageVolume = queryInterface
      .addColumn(
        'plans',
        'percentage_volume',
        {
          type: Sequelize.FLOAT
        }
      );

    let addPercentageWeight = queryInterface
      .addColumn(
        'plans',
        'percentage_weight',
        {
          type: Sequelize.FLOAT
        }
      );

    return Promise.all([addPercentageVolume, addPercentageWeight]);
  },

  down: (queryInterface, Sequelize) => {
    let removePV = queryInterface
      .removeColumn(
        'plans',
        'percentage_volume'
      );

    let removePW = queryInterface
      .removeColumn(
        'plans',
        'percentage_weight'
      );

    return Promise.all([removePV, removePW]);
  }
};
