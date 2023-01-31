const otpGenerator = require('otp-generator');

export class OtpGenerator {
  static getOtp() {
    return otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true,
    });
  }
}
