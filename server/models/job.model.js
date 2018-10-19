import Sequelize from 'sequelize';
import Database from '../config/database';
import VehicleModel from "./vehicle.model";
import StopModel from "./stop.model";
import FleetModel from "./fleet.model";
import ExportModel from './export.model';

const JobModel = Database.define('jobs', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.BIGINT(20)
  },
  date_depart: {
    allowNull: false,
    type: Sequelize.DATEONLY
  },
  use_toll: {
    allowNull: false,
    type: Sequelize.INTEGER(1)
  },
  use_time_routing_mode: {
    allowNull: false,
    type: Sequelize.INTEGER(1)
  },
  use_balance_vehicle_mode: {
    allowNull: false,
    type: Sequelize.INTEGER(1)
  },
  load_factor: {
    type: Sequelize.FLOAT
  },
  use_system_zone: {
    type: Sequelize.INTEGER(1)
  },
  balance_by: {
    type: Sequelize.INTEGER(11)
  },
  distance_leg_limit: {
    type: Sequelize.INTEGER(11)
  },
  leg_limit: {
    type: Sequelize.INTEGER(11)
  },
  space_offset: {
    type: Sequelize.INTEGER(11)
  },
  use_constraints: {
    type: Sequelize.INTEGER(11)
  },
  type: {
    allowNull: false,
    type: Sequelize.STRING
  },
  user_id: {
    allowNull: false,
    type: Sequelize.BIGINT(20)
  },
  file_id: {
    allowNull: false,
    type: Sequelize.BIGINT(20)
  }
}, {
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

JobModel.hasMany(VehicleModel, {foreignKey: 'job_id'});
JobModel.hasMany(StopModel, {foreignKey: 'job_id'});

VehicleModel.belongsTo(JobModel, {foreignKey: 'job_id'});
StopModel.belongsTo(JobModel, {foreignKey: 'job_id'});

JobModel.hasMany(FleetModel, {foreignKey: 'job_id'});
FleetModel.belongsTo(JobModel, {foreignKey: 'job_id'});

JobModel.hasMany(ExportModel, {foreignKey: 'job_id'});
ExportModel.belongsTo(JobModel, {foreignKey: 'job_id'});

export default JobModel;
