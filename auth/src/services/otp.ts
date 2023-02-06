const otpGenerator = require('otp-generator');

export class CodeGenerator {
  static getOtp() {
    return otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true,
    });
  }

  static getInviteCode() {
    return otpGenerator.generate(6, {
      upperCaseAlphabets: true,
      specialChars: false,
      lowerCaseAlphabets: true,
      digits: false,
    });
  }

  static getEmailVerificationCode() {
    return otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true,
    });
  }

  static getPhoneVerificationCode() {
    return otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true,
    });
  }
}
