import { BadRequestError } from '@rx-projects/common';
import { Request, Response } from 'express';
import { CustomerDataBaseLayer } from '../database-layer/customer-data-layer';
import { CustomerAttrs } from '../models/customer';

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
      throw new BadRequestError('email in use');
    }
    if (isPhoneNumberExist) {
      throw new BadRequestError('phoneNumber in use');
    }

    var user = await CustomerDataBaseLayer.signUpUser(req);
    return res.status(201).send(user);
  }

  static async signIn(req: Request, res: Response) {
    const { email, phoneNumber, countryCode, password } = req.body;
    var isEmailExist: any, isPhoneNumberExist: any;

    if (email !== null && email !== undefined) {
      isEmailExist = await CustomerDataBaseLayer.isExistingEmail(email);
      console.log(`login with email`);
    } else if (phoneNumber !== null && phoneNumber !== undefined) {
      isPhoneNumberExist = await CustomerDataBaseLayer.isExistingPhone(
        phoneNumber,
        countryCode
      );
      console.log(`login with phoneNumber`);
    }

    if (!isEmailExist && !(phoneNumber !== null && phoneNumber !== undefined)) {
      throw new BadRequestError('invalid email');
    } else if (
      !isPhoneNumberExist &&
      !(email !== null && email !== undefined)
    ) {
      throw new BadRequestError('invalid phoneNumber');
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

      const newRefreshToken = await CustomerDataBaseLayer.updateRefreshToken(
        id,
        emailId,
        phoneNo,
        countryCodeId
      );
      req.session = { jwt: accessToken, refreshToken: newRefreshToken };
      return res.status(200).send({
        userId: id,
        accessToken: accessToken,
        refreshToken: newRefreshToken,
      });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    var data = await CustomerDataBaseLayer.updateProfile(req);
    res.status(200).send(data);
  }

  static async changePassword(req: Request, res: Response) {
    var data = await CustomerDataBaseLayer.changePassword(req);
    res.status(200).send(data);
  }

  static async forgotPasswordSendOtp(req: Request, res: Response){
    var isEmailTriggered = await CustomerDataBaseLayer.forgotPasswordSendOtp(req);
    res.status(200).send({ msg: isEmailTriggered?'Email sent successfully':'Sms sent successfully' });
  }

  static async forgotPasswordVerifyOtp(req: Request, res: Response){
    var data = await CustomerDataBaseLayer.forgotPasswordVerifyOtp(req);
    res.status(200).send({data});
  }

  static async deleteCustomer(req: Request, res: Response) {
    var deletedAccountId = await CustomerDataBaseLayer.deleteCustomer(
      req.params.id
    );
    res.status(200).send({
      id: deletedAccountId,
      msg: 'Account deleted successfully',
    });
  }

  static async checkMFA(req: Request, res: Response) {
    var customers = await CustomerDataBaseLayer.checkMFA(req);
    res.status(200).send({ msg: 'Email and Sms triggered' });
  }

  static async sendEmailMFA(req: any, res: Response) {
    if (
      req.currentUser?.email === null ||
      req.currentUser?.email === undefined
    ) {
      throw new BadRequestError('invalid email id');
    }

    await CustomerDataBaseLayer.sendEmailMFA(
      req.currentUser?.email,
      req.currentUser?.id
    );
    res.status(200).send({ msg: 'Code sent successfully to verify email' });
  }

  static async sendSmsMFA(req: any, res: Response) {
    if (
      req.currentUser?.phoneNumber === null ||
      req.currentUser?.phoneNumber === undefined
    ) {
      throw new BadRequestError('invalid phone no');
    }

    await CustomerDataBaseLayer.sendSmsMFA(
      req.currentUser?.phoneNumber,
      req.currentUser?.countryCode,
      req.currentUser?.id
    );
    res
      .status(200)
      .send({ msg: 'Code sent successfully to verify phoneNumber' });
  }

  static async verifyEmail(req: any, res: Response) {
    var customers = await CustomerDataBaseLayer.verifyEmailMFA(req);
    res.status(200).send({ msg: 'Email verified' });
  }

  static async verifyPhoneNumber(req: any, res: Response) {
    var customers = await CustomerDataBaseLayer.verifyPhoneNumberMFA(req);
    res.status(200).send({ msg: 'Phone number verified' });
  }

  static async getCustomers(req: Request, res: Response) {
    var customers = await CustomerDataBaseLayer.getCustomers(req);
    res.status(200).send(customers);
  }

  static async getCustomerByStatus(req: Request, res: Response) {
    var customers = await CustomerDataBaseLayer.getCustomerByStatus(req);
    res.status(200).send(customers);
  }

  static async getCustomerByName(req: Request, res: Response) {
    var customers = await CustomerDataBaseLayer.getCustomerByName(req);
    res.status(200).send(customers);
  }

  static async getListOfDeletedAccounts(req: Request, res: Response) {
    var customers = await CustomerDataBaseLayer.getListOfDeletedAccounts(req);
    res.status(200).send(customers);
  }

  static async currentLoginUser(req: Request, res: Response) {
    var data = await CustomerDataBaseLayer.currentLoginUser(req);
    res.status(200).send(data);
  }

  static async getRefreshToken(req: any, res: Response) {
    const checkUser = await CustomerDataBaseLayer.isCustomerExist(
      req.currentUser?.id
    );
    if (!checkUser) {
      throw new BadRequestError('customer doesnot exist');
    }
    const accessToken = CustomerDataBaseLayer.createAccessToken(
      checkUser.id,
      checkUser.email,
      checkUser.phoneNumber,
      checkUser.countryCode
    );

    const refreshToken = CustomerDataBaseLayer.updateRefreshToken(
      checkUser.id,
      checkUser.email,
      checkUser.phoneNumber,
      checkUser.countryCode
    );

    return res
      .status(201)
      .send({ accessToken: accessToken, refreshToken: refreshToken });
  }

  static async signOut(req: Request, res: Response) {
    req.session = null;
    res.status(200).send({ msg: 'sign out successfully' });
  }
}
