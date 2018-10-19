import Sequelize from 'sequelize';
import Database from '../config/database';
import LegModel from "./leg.model";

const PlanModel = Database.define('plans', {
  id: { autoIncrement: true, primaryKey: true, type: Sequelize.BIGINT(20)},

  fleet_id: {type: Sequelize.BIGINT(20) },

  client_vehicle_id: {type: Sequelize.STRING(45) },

  time_start: {type: Sequelize.DATE },

  time_end: {type: Sequelize.DATE },

  num_of_route: {type: Sequelize.INTEGER(11) },

  total_wait_time: {type: Sequelize.FLOAT },

  total_eta: {type: Sequelize.FLOAT },

  total_time: {type: Sequelize.FLOAT },

  total_distance: {type: Sequelize.FLOAT },

  total_service_time: {type: Sequelize.FLOAT },

  total_toll_fee: {type: Sequelize.FLOAT },

  total_volume: {type: Sequelize.FLOAT },

  total_weight: {type: Sequelize.FLOAT },

  percentage_weight: {type: Sequelize.FLOAT },

  percentage_volume: {type: Sequelize.FLOAT },

  vehicle_id: {
    type: Sequelize.BIGINT(20),
    references: { model: 'vehicles', key: 'id' },
    onUpdate: 'restrict',
    onDelete: 'restrict'
  },
  duplicate_of: {
    type: Sequelize.BIGINT(20),
    references: { model: 'plans', key: 'id' },
    onUpdate: 'restrict',
    onDelete: 'restrict'
  },
  is_draft: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }

}, {
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

PlanModel.hasMany(LegModel, {foreignKey: 'plan_id'});
LegModel.belongsTo(PlanModel, {foreignKey: 'plan_id'});

export default PlanModel;
