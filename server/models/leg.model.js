import Sequelize from 'sequelize';
import Database from '../config/database';

const LegModel = Database.define('legs', {
  id: { autoIncrement: true, primaryKey: true, type: Sequelize.BIGINT(20)},

  seq: { type: Sequelize.INTEGER(11) },

  plan_id: { type: Sequelize.STRING(45) },

  start_id: { type: Sequelize.STRING(45) },

  stop_id: { type: Sequelize.STRING(45) },

  arrive_time: { type: Sequelize.DATE },

  finish_time: { type: Sequelize.DATE },

  wait_time: { type: Sequelize.INTEGER(11), },

  eta: { type: Sequelize.FLOAT },

  distance: { type: Sequelize.FLOAT },

  toll_fee: { type: Sequelize.FLOAT },

  volume: { type: Sequelize.FLOAT },

  weight: {type: Sequelize.FLOAT },

  route: { type: Sequelize.TEXT },

  service_time: {type: Sequelize.FLOAT },

}, {
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

export default LegModel;
