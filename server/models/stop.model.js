import Sequelize from 'sequelize';
import Database from '../config/database';
import PlanModel from "./plan.model";

const StopModel = Database.define('stops', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.BIGINT(20)
  },
  client_stop_id: {
    allowNull: false,
    type: Sequelize.STRING(45)
  },
  lat: {
    allowNull: false,
    type: Sequelize.DECIMAL(20, 8)
  },
  lng: {
    allowNull: false,
    type: Sequelize.DECIMAL(20, 8)
  },
  service_time: {
    type: Sequelize.INTEGER(11).UNSIGNED
  },
  time_start: {
    type: Sequelize.TIME
  },
  time_end: {
    type: Sequelize.TIME
  },
  volume: {
    type: Sequelize.FLOAT.UNSIGNED
  },
  weight: {
    type: Sequelize.FLOAT.UNSIGNED
  },
  dropoffs: {
    type: Sequelize.INTEGER(11).UNSIGNED
  },
  type: {
    type: Sequelize.INTEGER(1)
  },
  // initial seq when first import
  initial_seq: {
    type: Sequelize.INTEGER(11)
  },
  // seq after change
  seq: {
    type: Sequelize.INTEGER(11)
  },
  priority: {
    type: Sequelize.STRING
  },
  zone: {
    type: Sequelize.STRING
  },
  product_id: {
    type: Sequelize.STRING
  },
  name: {
    type: Sequelize.STRING
  },
  address: {
    type: Sequelize.STRING
  },
  tel: {
    type: Sequelize.STRING
  },
  // initial when first import
  initial_client_vehicle_id: {
    type: Sequelize.STRING(45)
  },

  client_vehicle_id: {
    type: Sequelize.STRING(45)
  },

  historical_client_vehicle_id_raw: {
    type: Sequelize.TEXT
  },
  historical_client_vehicle_id: {
    type: Sequelize.VIRTUAL,
    get: function () {
      return this.historical_client_vehicle_id_raw
        ? JSON.parse(this.historical_client_vehicle_id_raw)
        : null
    }
  },
  handled: {
    type: Sequelize.INTEGER(11)
  },
  plan_id: {
    type: Sequelize.BIGINT(20),
    references: { model: 'plans', key: 'id' },
    onUpdate: 'restrict',
    onDelete: 'restrict'
  }
}, {
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

PlanModel.hasMany(StopModel, {foreignKey: 'plan_id'});
StopModel.belongsTo(PlanModel, {foreignKey: 'plan_id'});

export default StopModel;
