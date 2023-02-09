import { BadRequestError } from '@rx-projects/common';
import { Request, Response } from 'express';
import { CustomerDataBaseLayer } from '../database-layer/customer-data-layer';
import { ResponseModel } from '../services/response-model';

export class CustomerDomain {
  // SIGNUP
  static async signUp(req: Request, res: Response) {
    const { email, phoneNumber, countryCode } = req.body;
    var isPhoneNumberExist;
    var isEmailExist;
    if (email != undefined || email != null) {
      isEmailExist = await CustomerDataBaseLayer.isExistingEmail(email);
    }
    if (phoneNumber != undefined || phoneNumber != null) {
      isPhoneNumberExist = await CustomerDataBaseLayer.isExistingPhone(
        phoneNumber,
        countryCode
      );
    }
    if (isEmailExist) {
      throw new BadRequestError('Email is already in use');
    }
    if (isPhoneNumberExist) {
      throw new BadRequestError('Phone number is already in use');
    }

    var user = await CustomerDataBaseLayer.signUpUser(req);
    return res
      .status(201)
      .send(ResponseModel.success(user, `Sign up successful`));
  }

  static async signIn(req: Request, res: Response) {
    const { email, phoneNumber, countryCode, password } = req.body;
    var isEmailExist: any, isPhoneNumberExist: any, isCustomerWithBoth: any;

    if (
      email !== null &&
      email !== undefined &&
      email != '' &&
      phoneNumber !== null &&
      phoneNumber !== undefined &&
      phoneNumber != ''
    ) {
      var isCustomerExistWithEmailPhone =
        await CustomerDataBaseLayer.isCustomerExistWithEmailAndPhone(
          email,
          phoneNumber,
          countryCode
        );
      if (!isCustomerExistWithEmailPhone) {
        throw new BadRequestError(
          'invalid email & phone number is sent for this customer request'
        );
      } else {
        isEmailExist = isCustomerExistWithEmailPhone;
        isPhoneNumberExist = isCustomerExistWithEmailPhone;
        console.log(`login with email & phoneNumber`);
      }
    } 
     if (email !== null && email !== undefined && email !== '') {
      isEmailExist = await CustomerDataBaseLayer.isExistingEmail(email);
      console.log(`login with email`);
    } 
     if (
      phoneNumber !== null &&
      phoneNumber !== undefined &&
      phoneNumber != ''
    ) {
      isPhoneNumberExist = await CustomerDataBaseLayer.isExistingPhone(
        phoneNumber,
        countryCode
      );
      console.log(`login with phoneNumber`);
    }

    if (!isEmailExist && !(phoneNumber !== null && phoneNumber !== undefined)) {
      throw new BadRequestError('customer does not exists with this email id');
    } else if (
      !isPhoneNumberExist &&
      !(email !== null && email !== undefined)
    ) {
      throw new BadRequestError('customer does not exists with this phone no');
    }

    const isPasswordMatch = await CustomerDataBaseLayer.checkPassword(
      isEmailExist ? isEmailExist.password : isPhoneNumberExist.password,
      password
    );

    if (!isPasswordMatch) {
      throw new BadRequestError('invalid password');
    } else {
      var id = isEmailExist ? isEmailExist.id : isPhoneNumberExist.id;
      var emailId = isEmailExist
        ? isEmailExist.email
        : isPhoneNumberExist.email;
      var phoneNo = isEmailExist
        ? isEmailExist.phoneNumber
        : isPhoneNumberExist.phoneNumber;

      var countryCodeId = isEmailExist
        ? isEmailExist.countryCode
        : isPhoneNumberExist.countryCode;

      const accessToken = await CustomerDataBaseLayer.createAccessToken(
        id,
        emailId,
        phoneNo,
        countryCodeId
      );
      //updating refresh token on login
      const newRefreshToken = await CustomerDataBaseLayer.updateRefreshToken(
        id,
        emailId,
        phoneNo,
        countryCodeId
      );
      req.session = { jwt: accessToken, refreshToken: newRefreshToken };
      const resData = JSON.parse(
        JSON.stringify(isEmailExist ? isEmailExist : isPhoneNumberExist)
      );
      resData.accessToken = accessToken;
      return res
        .status(200)
        .send(ResponseModel.success(resData, `Sign In successful`));
    }
  }

  static async updateProfile(req: Request, res: Response) {
    var data = await CustomerDataBaseLayer.updateProfile(req);
    res.status(200).send(ResponseModel.success(data, `Profile updated`));
  }

  static async changePassword(req: Request, res: Response) {
    var data = await CustomerDataBaseLayer.changePassword(req);
    res
      .status(200)
      .send(ResponseModel.success(data, `Password changed successfully`));
  }

  static async forgotPasswordSendOtp(req: Request, res: Response) {
    var isEmailTriggered = await CustomerDataBaseLayer.forgotPasswordSendOtp(
      req
    );
    res
      .status(200)
      .send(
        ResponseModel.success(
          { otp: true },
          isEmailTriggered ? 'Email sent successfully' : 'Sms sent successfully'
        )
      );
  }

  static async forgotPasswordVerifyOtp(req: Request, res: Response) {
    var data = await CustomerDataBaseLayer.forgotPasswordVerifyOtp(req);
    res
      .status(200)
      .send(ResponseModel.success(data, `New Password updated successfully`));
  }

  static async deleteCustomer(req: Request, res: Response) {
    var deletedAccountId = await CustomerDataBaseLayer.deleteCustomer(
      req.params.id
    );
    req.session = null;
    res
      .status(200)
      .send(
        ResponseModel.success(
          { id: deletedAccountId },
          `Account deleted successfully`
        )
      );
  }

  static async checkMFA(req: any, res: Response) {
    var customers = await CustomerDataBaseLayer.checkMFA(
      req,
      req.currentUser?.id
    );
    res
      .status(200)
      .send(
        ResponseModel.success(
          { id: req.currentUser?.id },
          `Email & Sms triggered`
        )
      );
  }

  static async sendEmailMFA(req: any, res: Response) {
    await CustomerDataBaseLayer.sendEmailMFA(
      req.body?.email,
      req.currentUser?.id
    );
    res
      .status(200)
      .send(
        ResponseModel.success(
          { id: req.currentUser?.id, email: req.body?.email },
          `Code sent successfully to verify email`
        )
      );
  }

  static async sendSmsMFA(req: any, res: Response) {
    await CustomerDataBaseLayer.sendSmsMFA(
      req.body?.phoneNumber,
      req.body?.countryCode,
      req.currentUser?.id
    );
    res.status(200).send(
      ResponseModel.success(
        {
          id: req.currentUser?.id,
          phoneNumber: req.body?.phoneNumber,
          countryCode: req.body?.countryCode,
        },
        `Code sent successfully to verify phoneNumber`
      )
    );
  }

  static async verifyEmail(req: any, res: Response) {
    var customers = await CustomerDataBaseLayer.verifyEmailMFA(req);
    res
      .status(200)
      .send(
        ResponseModel.success(
          { id: req.currentUser?.id, email: req.currentUser?.email },
          `Email Verified`
        )
      );
  }

  static async verifyPhoneNumber(req: any, res: Response) {
    var customers = await CustomerDataBaseLayer.verifyPhoneNumberMFA(req);
    res.status(200).send(
      ResponseModel.success(
        {
          id: req.currentUser?.id,
          phoneNumber: req.currentUser?.phoneNumber,
          countryCode: req.currentUser?.countryCode,
        },
        `Phone number verified`
      )
    );
  }

  static async getCustomers(req: Request, res: Response) {
    var customers = await CustomerDataBaseLayer.getCustomers(req);
    res.status(200).send(ResponseModel.success(customers));
  }

  static async getCustomerByStatus(req: Request, res: Response) {
    var customers = await CustomerDataBaseLayer.getCustomerByStatus(req);
    res.status(200).send(ResponseModel.success(customers));
  }

  static async getCustomerByName(req: Request, res: Response) {
    var customers = await CustomerDataBaseLayer.getCustomerByName(req);
    res.status(200).send(ResponseModel.success(customers));
  }

  static async getListOfDeletedAccounts(req: Request, res: Response) {
    var customers = await CustomerDataBaseLayer.getListOfDeletedAccounts(req);
    res.status(200).send(ResponseModel.success(customers));
  }

  static async currentLoginUser(req: Request, res: Response) {
    var data = await CustomerDataBaseLayer.currentLoginUser(req);
    res.status(200).send(ResponseModel.success(data));
  }

  static async getRefreshToken(req: any, res: Response) {
    const checkUser = await CustomerDataBaseLayer.isCustomerExist(
      req.currentUser?.id
    );
    if (!checkUser) {
      throw new BadRequestError('customer doesnot exist');
    }
    const accessToken = await CustomerDataBaseLayer.createAccessToken(
      checkUser.id,
      checkUser.email,
      checkUser.phoneNumber,
      checkUser.countryCode
    );

    const refreshToken = await CustomerDataBaseLayer.updateRefreshToken(
      checkUser.id,
      checkUser.email,
      checkUser.phoneNumber,
      checkUser.countryCode
    );

    return res.status(201).send({
      id: req.currentUser?.id,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }

  static async signOut(req: Request, res: Response) {
    req.session = null;
    res.status(200).send({ msg: 'sign out successfully' });
  }
}
