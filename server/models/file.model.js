
import Sequelize from 'sequelize';
import Database from '../config/database';
import ExportModel from './export.model';
import JobModel from './job.model';

const FileModel = Database.define('files', {
  id: {type: Sequelize.BIGINT(20), primaryKey: true, autoIncrement: true},
  url: Sequelize.STRING,
  title: Sequelize.STRING,
  entity_type: Sequelize.STRING,
  entity_id: Sequelize.BIGINT(20),
  storage_type: Sequelize.STRING,
  file_category_type: Sequelize.STRING,
  file_type: Sequelize.STRING,
  s3_key: Sequelize.STRING,
  s3_bucket: Sequelize.STRING,
  s3_region: Sequelize.STRING,
  media_type: Sequelize.STRING,
  format: Sequelize.STRING,
  original_file_name: Sequelize.STRING,
  file_size: Sequelize.BIGINT(20),
  width: Sequelize.INTEGER(11),
  height: Sequelize.INTEGER(11),
  thumbnails: Sequelize.TEXT,
  is_enabled: Sequelize.BOOLEAN,
  template_type: Sequelize.STRING,
  acl: Sequelize.STRING,
  user_id: {
    type: Sequelize.BIGINT(20),
    references: { model: 'users', key: 'id' },
    onUpdate: 'restrict',
    onDelete: 'restrict'
  }
}, {
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

FileModel.hasOne(ExportModel, {foreignKey: 'file_id'});
ExportModel.belongsTo(FileModel, {foreignKey: 'file_id'});

FileModel.hasOne(JobModel, {foreignKey: 'file_id'});
JobModel.belongsTo(FileModel, {foreignKey: 'file_id'});

export default FileModel;
