require('dotenv').config();
import Mailer from '../utils/mailer';
import EmailTemplateModel from '../models/email_template.model'
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';

exports.sendMail = async function (email, emailTemlate, data) {
  const emailTemplate = await EmailTemplateModel.findOne({where: {name: emailTemlate}});
  if (emailTemplate) {
    const body = ejs.render(emailTemplate.get('message'), data);
    const subject = ejs.render(emailTemplate.get('subject'), data);
    const htmlTemplate = fs.readFileSync(path.join(__dirname, '../views/mail/mail_temaplate.ejs'), 'utf8');
    const emailHtml = ejs.render(htmlTemplate, {
      body: body
    });
    const mailParams = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: subject,
      html: emailHtml
    };
    Mailer.sendMailHtml(mailParams);
  }
}
