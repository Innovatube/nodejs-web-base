import nodemailer from 'nodemailer';
import ses from 'nodemailer-ses-transport';
import logger from '../config/winston';

export default class Mailer {
  static sendMailHtml (mail) {
    const mailDrive = process.env.MAIL_DRIVER || 'smtp';
    let transporter = undefined;
    switch (mailDrive) {
      case 'ses' :
        transporter = nodemailer.createTransport(ses({
          accessKeyId: process.env.AWS_ACCESS_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.MAIL_REGION || 'us-east-1'
        }));
        break;
      default:
        transporter = nodemailer.createTransport({ // config mail server
          host: process.env.MAIL_HOST,
          port: process.env.MAIL_PORT,
          secure: process.env.MAIL_ENCRYPTION,
          auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
          }
        });
        break;
    }
    transporter.sendMail(mail).then( data => {
      logger.log('info', { msg: 'Send mail success.', data});
      console.log(data);
      return true;
    }).catch( err => {
      logger.log('error', { msg: 'Send mail error.', err});
      console.log(err);
      return false;
    });
  }
}
