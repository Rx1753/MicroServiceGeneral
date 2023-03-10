import { AdminDatabase } from '../database-layer/admin-data-layer';
import { Request, Response } from 'express-serve-static-core';
import { BadRequestError } from '@rx-projects/common';
import { AdminPermissionsAttrs } from '../models/admin-permissions';
import { ResponseModel } from '../services/response-model';

export class AdminDomain {

  //On check of permission allow to add permissions
  static async addPermissions(req: any, res: Response) {
    var isSuperAdminOrAdmin = await AdminDatabase.isSuperAdminOrAdmin(req.currentUser.id);
    if (!isSuperAdminOrAdmin) {
      throw new BadRequestError(
        'Permission Denied! Only super admin/admin can add permissions'
      );
    }
    const data: AdminPermissionsAttrs = req.body;
    var isPermissionExistWithTN = await AdminDatabase.checkPermissionExist(data);
    if (isPermissionExistWithTN) {
      throw new BadRequestError('permission already exist for this table');
    }
    var isPermissionAdded = await AdminDatabase.addPermission(data);
    if (isPermissionAdded) {
      res.status(201).send(ResponseModel.success(isPermissionAdded, `Permission added`));
    } else {
      throw new BadRequestError('permission not found');
    }
  }

  //On check of permission allow to create role
  static async createRole(req: any, res: Response) {
    const { roleName, permissionId } = req.body;
    var data = await AdminDatabase.createRole(roleName, permissionId,req.currentUser.id);
    res.status(201).send(ResponseModel.success(data, `Role created`));
  }

  //On check of permission allow to update role
  static async updateRolePermissions(req: any, res: Response) {
    var data = await AdminDatabase.updateRolePermissions(req,req.currentUser.id);
    res.status(200).send(ResponseModel.success(data, `Role updated`));
  }

  //Only Super admin can update the status of active/inactive admins
  static async statusUpdateForAdmin(req: any, res: Response) {
    var resData = await AdminDatabase.statusUpdateForAdmin(req);
    res.status(200).send(ResponseModel.success(resData, `updated admin status`));
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
      throw new BadRequestError('invalid email or doesn\'t exists');
    } else if (
      !isPhoneNumberExist &&
      !(email !== null && email !== undefined)
    ) {
      throw new BadRequestError('invalid phoneNumber or doesn\'t exists');
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
      //req.session = { jwt: accessToken, refreshToken: newRefreshToken };
      //console.log('session', req.session);
      const resData = JSON.parse(JSON.stringify(data));
      resData.accessToken = accessToken;
      resData.refreshToken = newRefreshToken;
      resData.session = { jwt: accessToken, refreshToken: newRefreshToken };

      return res.status(200).send(ResponseModel.success(resData, `Sign in successfully`));
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

    var resData = await AdminDatabase.addAdminUser(req);
    return res.status(201).send(ResponseModel.success(resData, `Admin created`));
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

    var resData = await AdminDatabase.addNewUser(req);
    return res.status(201).send(ResponseModel.success(resData, `User created`));
  }

  static async getUserById(req: Request, res: Response) {
    var resData = await AdminDatabase.getUserById(req);
    res.status(200).send(ResponseModel.success(resData, `Data fetched successfully ${req.params.id}`));
  }

  static async getAdminRoles(req: Request, res: Response) {
    var resData = await AdminDatabase.getAdminRoles(req);
    res.status(200).send(ResponseModel.success(resData, `Admin roles fetched for ${req.params.id}`));
  }

  static async getAdminRolesList(req: Request, res: Response) {
    var resData = await AdminDatabase.getAdminRolesList();
    res.status(200).send(ResponseModel.success(resData, `Admin roles list fetched`));
  }

  static async updateAdminRole(req: Request, res: Response) {
    const resData = await AdminDatabase.updateAdminRole(req);
    res.status(200).send(ResponseModel.success(resData, `Admin role updated`));
  }

  static async getPermissions(req: Request, res: Response) {
    const resData = await AdminDatabase.getPermissions(req);
    res.status(200).send(ResponseModel.success(resData, `Permissions fetched`));
  }

  static async getAdminList(req: Request, res: Response) {
    const resData = await AdminDatabase.getAdminList(req,false);// fetch only admin list
    res.status(200).send(ResponseModel.success(resData, `Admin list fetched`));
  }

  static async getAllList(req: Request, res: Response) {
    const resData = await AdminDatabase.getAdminList(req,true);// fetch others list too except super admin
    res.status(200).send(ResponseModel.success(resData, `All list fetched`));
  }

  static async getAdminByStatus(req: Request, res: Response) {
    const resData = await AdminDatabase.getAdminByStatus(req);
    res.status(200).send(ResponseModel.success(resData, `Admin list fetched by status`));
  }

  static async getAdminByName(req: Request, res: Response) {
    var resData = await AdminDatabase.getAdminByName(req);
    res.status(200).send(ResponseModel.success(resData, `Admin list fetched by name`));
  }

  static async forgotPassword(req: Request, res: Response) {
    var isEmailTriggered = await AdminDatabase.forgotPasswordMailTrigger(req);
    if (isEmailTriggered) {
      res.status(200).send(ResponseModel.success(isEmailTriggered, `Email sent successfully`));
    }
  }

  static async forgotPasswordVerification(req: Request, res: Response) {
    const data = await AdminDatabase.forgotPasswordVerification(req);
    res.status(200).send(ResponseModel.success(data, `Password updated successfully`));
  }


  static async changePassword(req: Request, res: Response) {
    const data = await AdminDatabase.changePassword(req);
    res.status(200).send(ResponseModel.success(data, `Password updated successfully`));
  }
}
