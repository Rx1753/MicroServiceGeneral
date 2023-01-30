const accountSid = 'ACb7957c8d47afe7465aa5d393f86c8390';
const authToken = '34abd2c20d9d962cbd2fd68e5ad0e264';
//const accountSid = 'AC8b4fdc5609c77d64ecb0f1621bf90129'; //second account MicroServiceGeneral SMS
//const authToken = 'f91c3ab70f9a13107db880d8bbd16523';
const client = require('twilio')(accountSid, authToken);

export class SendSmsService {
  static async sendSms(smsContent: string, sendTo: string) {
    try {
      console.log(`Sms Start`);
      var response = await client.messages.create({
        body: smsContent,
        from: '+16203123125',
        to: '+919974146404',
      });

      console.log(
        `Sms sent successfully :: ${response.sid} ---> ${response.to}`
      );
    } catch (error: any) {
      console.log(`Sms Error :: ${error}`);
    }
  }
}
