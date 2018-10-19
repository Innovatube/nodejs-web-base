import Sequelize from 'sequelize';
import Database from '../config/database';

const ExportModel = Database.define('exports', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.BIGINT(20)
  },
  file_id: {
    allowNull: false,
    type: Sequelize.BIGINT(20)
  },
  job_id: {
    allowNull: false,
    type: Sequelize.BIGINT(20)
  },
  user_id: {
    allowNull: false,
    type: Sequelize.BIGINT(20)
  },
  fleet_id: {
    allowNull: false,
    type: Sequelize.BIGINT(20)
  },
  type: {
    allowNull: false,
    type: Sequelize.STRING
  }
}, {
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

export default ExportModel;
