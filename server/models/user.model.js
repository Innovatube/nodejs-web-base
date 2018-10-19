import Sequelize from 'sequelize';
import Database from '../config/database';
import FileModel from './file.model';
import ExportModel from './export.model';

const UserModel = Database.define('users', {
  id: {type: Sequelize.BIGINT(20), primaryKey: true, autoIncrement: true},
  first_name: Sequelize.STRING,
  last_name: Sequelize.STRING,
  name: {
    allowNull: false,
    type: Sequelize.STRING
  },
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  status: Sequelize.BOOLEAN,
  is_admin: Sequelize.BOOLEAN,
  password_updated_at: {
    type: Sequelize.DATE
  },
  change_password_enforcement: {
    type: Sequelize.BOOLEAN
  },
  company: {
    type: Sequelize.STRING
  },
  profile_image_id: {
    type: Sequelize.BIGINT(20),
    defaultValue: 0
  },
  password_expired_days: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

UserModel.prototype.toJSON =  function () {
  var values = Object.assign({}, this.get());

  delete values.password;
  return values;
};

UserModel.belongsTo(FileModel, {foreignKey: 'profile_image_id'});


UserModel.hasMany(ExportModel, {foreignKey: 'user_id'});
ExportModel.belongsTo(UserModel, {foreignKey: 'user_id'});

export default UserModel;
