import nodemailer, { TransportOptions } from 'nodemailer';
import { google } from 'googleapis';
import { BadRequestError } from '@rx-projects/common';

const clientId =
  '395876580714-ha7isp3vfeo73cqjeuush8sqil27652p.apps.googleusercontent.com';
const clientSecreat = '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';
const redirect_uri = 'https://developers.google.com/oauthplayground';
const referesh_token =
  '1//04mUmXL0GZdGlCgYIARAAGAQSNgF-L9IrUj_HQ-MCTI1kkVaUOzo0g1CVtsH_8YjaPPRKN6XWHqBcaKKn3hVKHcPiJAR7RJDVTA';

export class MailService {
  static async mailTrigger(email: string, subject: string, html: string) {
    const oAuth2Client = new google.auth.OAuth2(
      clientId,
      clientSecreat,
      redirect_uri
    );
    oAuth2Client.setCredentials({
      scope: 'offline',
      refresh_token: referesh_token,
    });

    oAuth2Client.refreshAccessToken();
    const accessToken = (await oAuth2Client.getAccessToken()) as String;

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAUTH2',
        user: 'radixdt.1753@gmail.com',
        clientId: clientId,
        clientSecret: clientSecreat,
        refreshToken: referesh_token,
        accessToken: accessToken,
      },
    } as TransportOptions);

    var mailOptions = {
      from: 'radixdt.1753@gmail.com',
      to: email,
      subject: subject,
      text: 'Hello,',
      html: html,
    };

    transporter.sendMail(mailOptions, function (error: any, info: any) {
      if (error) {
        console.log(`sendMail :: ${error}`);
        throw new BadRequestError(error.message);
      } else {
        console.log('Email sent: ' + info.response);
        return true;
      }
    });
  }
}
