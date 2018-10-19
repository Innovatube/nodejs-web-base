import Sequelize from 'sequelize';
import Database from '../config/database';
import PlanModel from "./plan.model";
import * as Enum from '../config/enum';

const FleetModel = Database.define('fleets', {
  id: {autoIncrement: true, primaryKey: true, type: Sequelize.BIGINT(20)},
  job_id: { type: Sequelize.BIGINT(20) },
  task_id: {
    type: Sequelize.BIGINT(20),
    references: { model: 'tasks', key: 'id' },
    onUpdate: 'restrict',
    onDelete: 'restrict'
  },
  status: { type: Sequelize.ENUM(...Object.values(Enum.FLEET_STATUS))},
  description: { type: Sequelize.STRING },
  total_wait_time: { type: Sequelize.FLOAT },
  total_eta: { type: Sequelize.FLOAT },
  total_time: { type: Sequelize.FLOAT },
  total_distance: { type: Sequelize.FLOAT },
  total_service_time: { type: Sequelize.FLOAT },
  total_toll_fee: { type: Sequelize.FLOAT },
  total_volume: { type: Sequelize.FLOAT },
  total_weight: { type: Sequelize.FLOAT },
  unserved: {type: Sequelize.TEXT}
}, {
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

FleetModel.hasMany(PlanModel, {foreignKey: 'fleet_id'});
PlanModel.belongsTo(FleetModel, {foreignKey: 'fleet_id'});

export default FleetModel;
