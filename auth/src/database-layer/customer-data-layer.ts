import { BadRequestError } from '@rx-projects/common';
import { Customer, CustomerAttrs } from '../models/customer';
import { JwtService } from '../services/jwt';
import { Password } from '../services/password';
import { PayloadType } from '../services/string-values';
import { Request } from 'express';
import mongoose from 'mongoose';
import { CodeGenerator } from '../services/otp';
import { OtpCode } from '../models/otp-code';
import { Common } from '../services/common';
import { HtmlTemplate } from '../services/html-templates';
import { MailService } from '../services/mail-service';
import { SendSmsService } from '../services/send-sms-service';
import { SmsContent } from '../services/sms-content';

export class CustomerDataBaseLayer {
  static async isExistingEmail(email: String) {
    const existingEmail = await Customer.findOne({
      $and: [{ email }, { isActive: true, isDeletedAccount: false }],
    });
    return existingEmail;
  }
  static async isExistingPhone(phoneNumber: string, countryCode: string) {
    const existingPhone = await Customer.findOne({
      $and: [
        { phoneNumber },
        { countryCode: countryCode },
        { isActive: true, isDeletedAccount: false },
      ],
    });
    return existingPhone;
  }

  static async isCustomerExist(id: String) {
    var isUserExist = await Customer.findById({ _id: id });
    return isUserExist;
  }

  static async createAccessToken(
    id: string,
    email: string,
    phoneNumber: string,
    countryCode: string
  ) {
    const accessToken = await JwtService.accessToken(
      id,
      email,
      phoneNumber,
      countryCode,
      PayloadType.CustomerType
    );
    return accessToken;
  }

  static async getRefreshToken(
    id: string,
    email: string,
    phoneNumber: string,
    countryCode: string
  ) {
    return await JwtService.refreshToken(
      id,
      email,
      phoneNumber,
      countryCode,
      PayloadType.CustomerType
    );
  }

  static async updateRefreshToken(
    id: string,
    email: string,
    phoneNumber: string,
    countryCode: string
  ) {
    const refreshToken = await JwtService.refreshToken(
      id,
      email,
      phoneNumber,
      countryCode,
      PayloadType.CustomerType
    );
    const customer = await Customer.findByIdAndUpdate(id, {
      refreshToken: refreshToken,
    });
    return refreshToken;
  }

  static async signUpUser(req: any) {
    const {
      userName,
      firstName,
      lastName,
      password,
      email,
      phoneNumber,
      countryCode,
      referralCode,
      gender,
      dob,
    } = req.body;
    const inviteCode = CodeGenerator.getInviteCode();
    var user: CustomerAttrs;
    const hashPassword = await Password.toHash(password); //excrypted password
    try {
      user = {
        userName,
        firstName,
        lastName,
        password,
        inviteCode,
        gender,
        dob,
        countryCode,
      };
      user.password = hashPassword;
      if (
        req.body.phoneNumber == null &&
        req.body.phoneNumber == undefined &&
        req.body.email != null &&
        req.body.email != undefined
      ) {
        console.log('sign up with email');
        user.email = email;
        user.phoneNumber = null;
      } else if (
        req.body.phoneNumber != null &&
        req.body.phoneNumber != undefined &&
        req.body.email == null &&
        req.body.email == undefined
      ) {
        console.log('sign up with phoneNumber');
        user.phoneNumber = phoneNumber;
        user.email = null;
      } else {
        user.phoneNumber = phoneNumber;
        user.email = email;
      }

      //check for referralcode if refered by another customer
      if (referralCode != null && referralCode !== undefined) {
        const isReferralCustomerExist = await Customer.findOne({
          inviteCode: referralCode,
        });

        if (isReferralCustomerExist) {
          user.referralId = isReferralCustomerExist.id;
          console.log(
            `${firstName} ${lastName} customer is referred by -> ${isReferralCustomerExist?.firstName} / ${isReferralCustomerExist?.id}`
          );
          //update the reward points for referred customer
        }
      }

      const saveData = Customer.build(user);
      //refresh token directly save to db on sign up
      saveData.refreshToken = await JwtService.refreshToken(
        saveData._id,
        saveData.email,
        saveData.phoneNumber,
        saveData.countryCode,
        PayloadType.CustomerType
      );
      await saveData.save();

      var userJwt = await CustomerDataBaseLayer.createAccessToken(
        saveData._id,
        saveData.email,
        saveData.phoneNumber,
        saveData.countryCode
      );

      // Store it on session object
      req.session = { jwt: userJwt };
      const resData = JSON.parse(JSON.stringify(saveData));
      resData.accessToken = userJwt;
      return resData;
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async checkPassword(existingPassword: string, password: string) {
    console.log(
      `exisitng password :: ${existingPassword} , password ${password}`
    );
    return await Password.compare(existingPassword, password);
  }

  static async updateProfile(req: Request) {
    var id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestError('invalid param id');
    }
    var { email, phoneNumber, countryCode } = req.body;
    var isUserExist = await CustomerDataBaseLayer.isCustomerExist(id);
    if (!isUserExist) {
      throw new BadRequestError('invalid user');
    } else if (isUserExist && isUserExist?.isDeletedAccount) {
      throw new BadRequestError('account has been deleted');
    }

    if (email !== null && email !== undefined && isUserExist.email !== email) {
      var isEmailExist = await CustomerDataBaseLayer.isExistingEmail(email);

      if (isEmailExist) {
        throw new BadRequestError(
          `${email} already exist for another user. Try it with new email`
        );
      }
    }

    if (
      phoneNumber !== null &&
      phoneNumber !== undefined &&
      isUserExist.phoneNumber !== phoneNumber
    ) {
      var isPhoneNumberExist = await CustomerDataBaseLayer.isExistingPhone(
        phoneNumber,
        countryCode
      );

      if (isPhoneNumberExist) {
        throw new BadRequestError(
          `${countryCode} ${phoneNumber} already exist for another user. Try it with new phoneNumber`
        );
      }
    }

    const userJwt = await CustomerDataBaseLayer.createAccessToken(
      id,
      email,
      phoneNumber,
      countryCode
    );
    const refreshToken = await CustomerDataBaseLayer.getRefreshToken(
      id,
      email,
      phoneNumber,
      countryCode
    );

    var updateData = await Customer.findByIdAndUpdate(id, {
      email: email,
      phoneNumber: phoneNumber,
      countryCode: countryCode,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      imageUrl: req.body.imageUrl,
      gender: req.body.gender,
      dob: req.body.dob,
      refreshToken: refreshToken,
    });

    var updatedData = await Customer.findById({ _id: id });
    req.session = { jwt: userJwt };
    const resData = JSON.parse(JSON.stringify(updatedData));
    resData.accessToken = userJwt;
    return resData;
  }

  static async changePassword(req: any) {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const checkUser = await CustomerDataBaseLayer.isCustomerExist(
      req.currentUser?.id
    );
    if (!checkUser) {
      throw new BadRequestError('customer doesnot exist');
    }
    const verifyPassword = await Password.compare(
      checkUser.password,
      oldPassword
    );
    if (!verifyPassword) {
      throw new BadRequestError('invalid old password');
    }
    const newHashPassword = await Password.toHash(newPassword);
    const refreshToken = await CustomerDataBaseLayer.getRefreshToken(
      checkUser.id,
      checkUser.email,
      checkUser.phoneNumber,
      checkUser.countryCode
    );
    const accessToken = await CustomerDataBaseLayer.createAccessToken(
      checkUser.id,
      checkUser.email,
      checkUser.phoneNumber,
      checkUser.countryCode
    );
    await Customer.findByIdAndUpdate(checkUser.id, {
      password: newHashPassword,
      refreshToken: refreshToken,
    });
    return {
      msg: 'password changed successfully',
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  static async forgotPasswordSendOtp(req: Request) {
    try {
      const { email, phoneNumber, countryCode } = req.body;
      var customer: any, isEmail: any;
      if (email !== undefined && email !== null) {
        isEmail = true;
        customer = await CustomerDataBaseLayer.isExistingEmail(email);
      } else if (phoneNumber !== undefined && phoneNumber !== null) {
        isEmail = false;
        customer = await CustomerDataBaseLayer.isExistingPhone(
          phoneNumber,
          countryCode
        );
      }
      if (!customer) {
        throw new BadRequestError(
          "customer doesn't exist with this email/phone number"
        );
      }
      //Generate OTP
      const code = CodeGenerator.getOtp();
      const expirationTime = Common.addSecondsToDate(120);
      if (isEmail) {
        //Send email
        var htmlTemplate = HtmlTemplate.sendOtpOnForgotPassword(
          `${customer.firstName} ${customer.lastName}`,
          code
        );
        await MailService.mailTrigger(email, 'Forgot Password ', htmlTemplate);
      } else {
        //Send sms
        await SendSmsService.sendSms(
          SmsContent.sendSmsCustomerForgotPassword(),
          '+919974146404'
        );
      }
      var isOtpExists;
      if (isEmail) {
        isOtpExists = await OtpCode.findOne({
          type: 'email',
          email: email,
        });
      } else {
        isOtpExists = await OtpCode.findOne({
          type: 'phone',
          phoneNumber: `${countryCode}${phoneNumber}`,
        });
      }

      //Create OTP instance in DB
      if (isOtpExists) {
        await OtpCode.findByIdAndUpdate(isOtpExists.id, {
          type: isEmail ? 'email' : 'phone',
          email: email,
          code: code,
          phoneNumber: `${countryCode}${phoneNumber}`,
          expirationTime: expirationTime,
          userId: customer.id,
        });
      } else {
        var createVerificationCode = OtpCode.build({
          type: isEmail ? 'email' : 'phone',
          email: email,
          code: code,
          phoneNumber: `${countryCode}${phoneNumber}`,
          expirationTime: expirationTime,
          userId: customer.id,
        });
        await createVerificationCode.save();
      }
      console.log(
        `${isEmail ? 'Email' : 'Sms'} trigged and save it to db :: ${code}`
      );
      return isEmail;
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async forgotPasswordVerifyOtp(req: Request) {
    const { code, password } = req.body;
    const otpCheck = await OtpCode.findOne({ code: code });
    if (!otpCheck) {
      throw new BadRequestError('Invalid Otp');
    } else {
      console.log(`verify otp :: ${otpCheck.userId}`);
    }
    var dateNow = new Date();
    console.log(
      `Verify Otp Expiry Date  :: ${otpCheck.expirationTime.toUTCString()}`
    );
    console.log(`Verify Otp Current Date :: ${dateNow.toUTCString()}`);
    if (otpCheck.expirationTime < dateNow) {
      throw new BadRequestError('Otp Expired!');
    }
    const hashed = await Password.toHash(password);
    const newData = await Customer.findByIdAndUpdate(otpCheck.userId, {
      password: hashed,
    });
    if (newData) {
      console.log('password updated');
      const accessToken = await CustomerDataBaseLayer.createAccessToken(
        newData.id,
        newData.email,
        newData.phoneNumber,
        newData.countryCode
      );
      const newRefreshToken = await CustomerDataBaseLayer.updateRefreshToken(
        newData.id,
        newData.email,
        newData.phoneNumber,
        newData.countryCode
      );
      //delete otp entry for the forgot password
      await OtpCode.findByIdAndDelete(otpCheck.id);
      req.session = { jwt: accessToken, refreshToken: newRefreshToken };
      return { accessToken: accessToken, refreshToken: newRefreshToken };
    } else {
      throw new BadRequestError('Something went wrong');
    }
  }

  static async deleteCustomer(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestError('invalid param id');
    }

    var isUserExist = await CustomerDataBaseLayer.isCustomerExist(id);
    if (!isUserExist) {
      throw new BadRequestError('user does not exists');
    }

    //update isDeletedAccount = true on account deletion
    var data = await Customer.findByIdAndUpdate(id, {
      isDeletedAccount: true,
      isActive: false,
    });
    return id;
  }

  static async checkMFA(req: Request) {
    var { isMFA, email, phoneNumber, countryCode } = req.body;
    await Customer.findByIdAndUpdate(req.params.id, { isMFA: isMFA });
    if (isMFA) {
      if (email !== null && email !== undefined) {
        await this.sendEmailMFA(email, req.params.id);
      }

      if (phoneNumber !== null && phoneNumber !== undefined) {
        await this.sendSmsMFA(phoneNumber, countryCode, req.params.id);
      }
    } else {
      console.log(`MFA disabled`);
    }
  }

  static async sendEmailMFA(email: string, userId: string) {
    try {
      var isEmailExist = await CustomerDataBaseLayer.isExistingEmail(email);
      if (!isEmailExist) {
        throw new BadRequestError('invalid email id for mfa');
      } else if (isEmailExist && !isEmailExist.isMFA) {
        throw new BadRequestError('mfa is disable');
      } else if (isEmailExist && !isEmailExist.isEmailVerified) {
        //Delete existing email code
        await OtpCode.findOneAndDelete({
          type: 'email',
          userId: userId,
          email: email,
        });

        const code = CodeGenerator.getEmailVerificationCode();
        var expirationTime = Common.addDaysToDate(8);
        var createVerificationCode = OtpCode.build({
          type: 'email',
          email: email,
          userId: userId,
          code: code,
          expirationTime: expirationTime,
        });
        await createVerificationCode.save();
        console.log(`emailVerification :: ${createVerificationCode}`);
        // await MailService.mailTrigger(email, 'Email Verification', "<h1>Hello ,</h1><p>here, is your email verfication code,</br> pls enter it in email verification code field <B>" + code + "</B> . </p>");
        return;
      }
    } catch (err: any) {
      console.log(err.message);
      throw new BadRequestError(err.message);
    }
  }

  static async sendSmsMFA(
    phoneNumber: string,
    countryCode: string,
    id: string
  ) {
    try {
      var isPhoneNumberExist = await CustomerDataBaseLayer.isExistingPhone(
        phoneNumber,
        countryCode
      );
      if (!isPhoneNumberExist) {
        throw new BadRequestError('invalid phoneNumber for mfa');
      } else if (isPhoneNumberExist && !isPhoneNumberExist.isMFA) {
        throw new BadRequestError('mfa is disable');
      } else if (isPhoneNumberExist && !isPhoneNumberExist.isPhoneVerified) {
        //delete existing otp code
        await OtpCode.findOneAndDelete({
          type: 'phone',
          userId: id,
          phoneNumber: `${countryCode}${phoneNumber}`,
        });

        const code = CodeGenerator.getPhoneVerificationCode();
        const expirationTime = Common.addDaysToDate(8);

        var createVerificationCode = OtpCode.build({
          type: 'phone',
          phoneNumber: `${countryCode}${phoneNumber}`,
          userId: id,
          code: code,
          expirationTime: expirationTime,
        });
        await createVerificationCode.save();
        console.log(`phoneNumber verification :: ${createVerificationCode}`);
        //Trigger sms
        return;
      }
    } catch (err: any) {
      console.log(err.message);
      throw new BadRequestError(err.message);
    }
  }

  static async verifyEmailMFA(req: any) {
    if (req.currentUser.email == undefined || req.currentUser.email == null) {
      throw new BadRequestError('invalid email id ');
    }
    const { code } = req.body;
    const inviteCodeCheck = await OtpCode.findOne({
      $and: [
        { code: code },
        { userId: req.currentUser.id },
        { email: req.currentUser.email },
        { type: 'email' },
      ],
    });
    if (inviteCodeCheck) {
      const timeStamp: any = inviteCodeCheck?.updatedAt;
      const diff = new Date().getTime() - timeStamp;
      var diffSecound = Math.ceil((diff / 1000) % 60);

      console.log(diffSecound);
      console.log(inviteCodeCheck?.expirationTime!);

      if (300000 > diffSecound) {
        await Customer.findByIdAndUpdate(req.currentUser.id, {
          isMFA: true,
          isEmailVerified: true,
        });
        return;
      } else {
        await OtpCode.findByIdAndDelete(inviteCodeCheck.id);
        throw new BadRequestError('Ohh No!! Your Verification code is expired');
      }
    } else {
      throw new BadRequestError('Your Code is not matched');
    }
  }

  static async verifyPhoneNumberMFA(req: any) {
    if (
      req.currentUser.phoneNumber == undefined ||
      req.currentUser.phoneNumber == null
    ) {
      throw new BadRequestError('invalid phone no');
    }
    const { code } = req.body;
    const inviteCodeCheck = await OtpCode.findOne({
      $and: [
        { code: code },
        { userId: req.currentUser.id },
        {
          phoneNumber: `${req.currentUser.countryCode}${req.currentUser.phoneNumber}`,
        },
        { type: 'phone' },
      ],
    });
    if (inviteCodeCheck) {
      const timeStamp: any = inviteCodeCheck?.updatedAt;
      const diff = new Date().getTime() - timeStamp;
      var diffSecound = Math.ceil((diff / 1000) % 60);

      console.log(diffSecound);
      console.log(inviteCodeCheck?.expirationTime!);

      if (300000 > diffSecound) {
        await Customer.findByIdAndUpdate(req.currentUser.id, {
          isMFA: true,
          isPhoneVerified: true,
        });
        return;
      } else {
        await OtpCode.findByIdAndDelete(inviteCodeCheck.id);
        throw new BadRequestError('Ohh No!! Your Verification code is expired');
      }
    } else {
      throw new BadRequestError('Your Code is not matched');
    }
  }

  static async getCustomers(req: any) {
    var result;
    if (req.query?.pageNo == null && req.query?.limit == null) {
      //Without pagination
      const totalData = await Customer.find({
        isActive: true,
        isDeletedAccount: false,
      });
      result = {
        totalRecords: totalData.length,
        page: null,
        nextPage: null,
        result: totalData,
      };
    } else {
      //Pagination
      if (req.query?.pageNo == null || req.query?.limit == null) {
        throw new BadRequestError('pageNo & limit is required as int');
      } else if (
        (req.query?.limit != null && isNaN(req.query?.limit)) ||
        (req.query?.pageNo != null && isNaN(req.query?.pageNo))
      ) {
        throw new BadRequestError(
          'Invalid data type! Only int value is allowed'
        );
      }

      var pageNo = parseInt(req.query.pageNo);
      var limit = parseInt(req.query.limit);
      var skip = pageNo * limit;

      const totalData = await Customer.find({
        isActive: true,
        isDeletedAccount: false,
      });
      console.log(
        `pageNo : ${pageNo} , limit : ${limit} , skip :: ${skip}, totalCount : ${totalData.length} `
      );
      var data = await Customer.find({ isActive: true })
        .skip(skip)
        .limit(limit);

      console.log(`pageNo : ${pageNo}, nextPage : ${pageNo + 1}`);

      result = {
        totalRecords: totalData.length,
        page: pageNo,
        nextPage: pageNo + 1,
        result: data,
      };
    }
    return result;
  }

  static async getCustomerByStatus(req: Request) {
    var customers = await Customer.find({
      isActive: req.query?.status,
      isDeletedAccount: false,
    });
    return customers;
  }

  static async getCustomerByName(req: Request) {
    if (
      req.query?.firstName &&
      req.query?.firstName != null &&
      req.query?.firstName != '' &&
      req.query?.lastName &&
      req.query?.lastName != null &&
      req.query?.lastName != ''
    ) {
      //search by Customer firstName & lastName
      const data = await Customer.find({
        isActive: true,
        isDeletedAccount: false,
        $or: [
          {
            firstName: { $regex: req.query?.firstName, $options: 'i' },
            lastName: { $regex: req.query?.lastName, $options: 'i' },
          },
        ],
      });
      return data;
    } else {
      //give list on empty userName
      const data = await Customer.find({
        isActive: true,
        isDeletedAccount: false,
      });
      return data;
    }
  }

  static async getListOfDeletedAccounts(req: any) {
    var result;
    if (req.query?.pageNo == null && req.query?.limit == null) {
      //Without pagination
      const totalData = await Customer.find({
        isActive: false,
        isDeletedAccount: true,
      });
      result = {
        totalRecords: totalData.length,
        page: null,
        nextPage: null,
        result: totalData,
      };
    } else {
      //Pagination
      if (req.query?.pageNo == null || req.query?.limit == null) {
        throw new BadRequestError('pageNo & limit is required as int');
      } else if (
        (req.query?.limit != null && isNaN(req.query?.limit)) ||
        (req.query?.pageNo != null && isNaN(req.query?.pageNo))
      ) {
        throw new BadRequestError(
          'Invalid data type! Only int value is allowed'
        );
      }

      var pageNo = parseInt(req.query.pageNo);
      var limit = parseInt(req.query.limit);
      var skip = pageNo * limit;

      const totalData = await Customer.find({
        isActive: false,
        isDeletedAccount: true,
      });
      console.log(
        `pageNo : ${pageNo} , limit : ${limit} , skip :: ${skip}, totalCount : ${totalData.length} `
      );
      var data = await Customer.find({
        isActive: false,
        isDeletedAccount: true,
      })
        .skip(skip)
        .limit(limit);

      console.log(`pageNo : ${pageNo}, nextPage : ${pageNo + 1}`);

      result = {
        totalRecords: totalData.length,
        page: pageNo,
        nextPage: pageNo + 1,
        result: data,
      };
    }
    return result;
  }

  static async currentLoginUser(req: any) {
    var data = await Customer.findById(req.currentuser.id);
    return data;
  }
}
