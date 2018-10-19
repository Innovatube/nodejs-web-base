
import Sequelize from 'sequelize';
import Database from '../config/database';

const EmailTemplateModel = Database.define('email_templates', {
  id: {type: Sequelize.BIGINT(20), primaryKey: true, autoIncrement: true},
  name: Sequelize.STRING,
  message: Sequelize.STRING,
  subject: Sequelize.STRING
}, {
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

export default EmailTemplateModel;
