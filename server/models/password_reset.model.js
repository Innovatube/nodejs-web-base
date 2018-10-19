import Sequelize from 'sequelize';
import Database from '../config/database';

const PasswordResetModel = Database.define('password_resets', {
  id: {type: Sequelize.BIGINT(20), primaryKey: true, autoIncrement: true},
  token: Sequelize.STRING,
  user_id: Sequelize.BIGINT(20)
}, {
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

export default PasswordResetModel;
