import { AdminDatabase } from '../database-layer/admin-data-layer';
import { Request, Response } from 'express-serve-static-core';
import { BadRequestError } from '@rx-projects/common';
import { AdminPermissionsAttrs } from '../models/admin-permissions';

export class AdminDomain {
  static async addPermissions(req: Request, res: Response) {
    const data: AdminPermissionsAttrs = req.body;
    var isPermissionExistWithTN = await AdminDatabase.checkPermissionExist(
      data
    );
    if (isPermissionExistWithTN) {
      throw new BadRequestError('permission already exist for this table');
    }
    var isPermissionAdded = await AdminDatabase.addPermission(data);
    if (isPermissionAdded) {
      res.status(201).send(isPermissionAdded);
    } else {
      throw new BadRequestError('permission not found');
    }
  }

  static async createRole(req: Request, res: Response) {
    var data = await AdminDatabase.createRole(req);
    res.status(200).send(data);
  }

  static async updateRolePermissions(req: Request, res: Response) {
    var data = await AdminDatabase.updateRolePermissions(req);
    res.status(200).send(data);
  }

  // SIGNIN
  static async signIn(req: Request, res: Response) {
    const { email, phoneNumber, countryCode, password } = req.body;
    var isEmailExist: any, isPhoneNumberExist: any;

    if (email != null && email != undefined) {
      console.log('login with email');
      isEmailExist = await AdminDatabase.isExistingEmail(email);
    } else if (phoneNumber != null && phoneNumber != undefined) {
      console.log('login with phoneNumber');
      isPhoneNumberExist = await AdminDatabase.isExistingPhone(
        phoneNumber,
        countryCode
      );
    }

    if (!isEmailExist && !(phoneNumber !== null && phoneNumber !== undefined)) {
      throw new BadRequestError('invalid email');
    } else if (
      !isPhoneNumberExist &&
      !(email !== null && email !== undefined)
    ) {
      throw new BadRequestError('invalid phoneNumber');
    }
    const passwordMatch = await AdminDatabase.checkPassword(
      isEmailExist ? isEmailExist.password : isPhoneNumberExist.password,
      password
    );
    console.log(passwordMatch);

    if (!passwordMatch) {
      throw new BadRequestError('Invalid Password');
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

      var data = isEmailExist ? isEmailExist : isPhoneNumberExist;

      const accessToken = await AdminDatabase.createAccessToken(
        id,
        emailId,
        phoneNo,
        countryCodeId
      );
      const newRefreshToken = await AdminDatabase.updateRefreshToken(
        id,
        emailId,
        phoneNo,
        countryCodeId
      );
      req.session = { jwt: accessToken, refreshToken: newRefreshToken };
      //console.log('session', req.session);
      const resData = JSON.parse(JSON.stringify(data));
      resData.accessToken = accessToken;
      resData.refreshToken = newRefreshToken;
    
      return res.status(201).send(resData);
    }
  }

  static async addAdmin(req: Request, res: Response) {
    const { email, phoneNumber, countryCode } = req.body;
    var isPhoneNumberExist: any;
    var isEmailExist: any;

    if (email != undefined || email != null) {
      isEmailExist = await AdminDatabase.isExistingEmail(email);
    }

    if (phoneNumber != undefined || phoneNumber != null) {
      isPhoneNumberExist = await AdminDatabase.isExistingPhone(
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

    var user = await AdminDatabase.addAdminUser(req);
    return res.status(201).send(user);
  }

  static async addNewUser(req: Request, res: Response) {
    const { email, phoneNumber, countryCode } = req.body;
    var isPhoneNumberExist: any;
    var isEmailExist: any;

    if (email != undefined || email != null) {
      isEmailExist = await AdminDatabase.isExistingEmail(email);
    }

    if (phoneNumber != undefined || phoneNumber != null) {
      isPhoneNumberExist = await AdminDatabase.isExistingPhone(
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

    var user = await AdminDatabase.addNewUser(req);
    return res.status(201).send(user);
  }

  static async getUserById(req: Request, res: Response) {
    var user = await AdminDatabase.getUserById(req);
    if (!user) {
      throw new BadRequestError('User does not exist');
    }
    res.status(200).send(user);
  }

  static async getAdminRoles(req: Request, res: Response) {
    var user = await AdminDatabase.getAdminRoles(req);
    if (!user) {
      throw new BadRequestError('User does not exist');
    }
    res.status(200).send(user);
  }

  static async getAdminRolesList(req: Request, res: Response) {
    var list = await AdminDatabase.getAdminRolesList(req);
    res.status(200).send(list);
  }

  static async updateAdminRole(req: Request, res: Response) {
    const data = await AdminDatabase.updateAdminRole(req);
    res.status(200).send(data);
  }

  static async getAdminList(req: Request, res: Response) {
    const data = await AdminDatabase.getAdminList(req);
    res.status(200).send(data);
  }
  static async getAdminByStatus(req: Request, res: Response) {
    const data = await AdminDatabase.getAdminByStatus(req);
    res.status(200).send(data);
  }

  static async statusUpdateForAdmin(req: Request, res: Response) {
    var data = await AdminDatabase.statusUpdateForAdmin(req);
    res.status(200).send(data);
  }

  static async getAdminByName(req: Request, res: Response) {
    var data = await AdminDatabase.getAdminByName(req);
    res.status(200).send({
      success: true,
      data: data,
    });
  }

  static async forgotPassword(req: Request, res: Response) {
    var isEmailTriggered = await AdminDatabase.forgotPasswordMailTrigger(req);
    if (isEmailTriggered) {
      res.status(200).send({ message: 'Email send successfully' });
    }
  }

  static async forgotPasswordVerification(req: Request, res: Response) {
    const data = await AdminDatabase.forgotPasswordVerification(req);
    res.status(200).send(data);
  }
}
