import { AdminDatase } from '../database-layer/admin-data-layer';
import { Request, Response } from 'express-serve-static-core';
import { BadRequestError } from '@rx-projects/common';
import { AdminPermissionsAttrs } from '../models/admin-permissions';
import { JwtService } from '../services/jwt';
import { PayloadType } from '../services/string-values';

export class AdminDomain {
  static async addPermissions(req: Request, res: Response) {
    const data: AdminPermissionsAttrs = req.body;
    var isPermissionExistWithTN = await AdminDatase.checkPermissionExist(data);
    if (isPermissionExistWithTN) {
      throw new BadRequestError('permission already exist for this table');
    }
    var isPermissionAdded = await AdminDatase.addPermission(data);
    if (isPermissionAdded) {
      res.status(201).send(isPermissionAdded);
    } else {
      throw new BadRequestError('permission not found');
    }
  }

  static async createRole(req: Request, res: Response) {
    var data = await AdminDatase.createRole(req);
    res.status(200).send(data);
  }

  static async updateRolePermissions(req: Request, res: Response) {
    var data = await AdminDatase.updateRolePermissions(req);
    res.status(200).send(data);
  }

  // SIGNIN
  static async signIn(req: Request, res: Response) {
    const { password } = req.body;
    var email: string,
      phoneNumber: Number,
      isEmail = false;

    var exitstingEmail: any, existingPhone: any;

    if (
      req.body.email != null &&
      req.body.email != undefined &&
      req.body.phoneNumber == null &&
      req.body.phoneNumber == undefined
    ) {
      console.log('sign up with email');
      email = req.body.email;
      exitstingEmail = await AdminDatase.isExistingEmail(email);
      isEmail = true;
    }
    if (
      req.body.phoneNumber != null &&
      req.body.phoneNumber != undefined &&
      req.body.email == null &&
      req.body.email == undefined
    ) {
      console.log('sign up with phone');
      phoneNumber = req.body.phoneNumber;
      existingPhone = await AdminDatase.isExistingPhone(phoneNumber);
    }

    if (isEmail && !exitstingEmail) {
      throw new BadRequestError('Invalid Email');
    }

    if (!isEmail && !existingPhone) {
      throw new BadRequestError('Invalid PhoneNumber');
    }

    const passwordMatch = await AdminDatase.checkPassword(
      isEmail ? exitstingEmail.password : existingPhone.password,
      password
    );
    console.log(passwordMatch);

    if (!passwordMatch) {
      throw new BadRequestError('Invalid Password');
    }

    if (exitstingEmail) {
      const accessToken = await JwtService.accessToken({
        email: exitstingEmail.email,
        id: exitstingEmail.id,
        phoneNumber: exitstingEmail.phoneNumber,
        type: PayloadType.AdminType,
      });
      const newRefreshToken = await AdminDatase.updateRefreshToken(
        exitstingEmail.id,
        exitstingEmail.email,
        exitstingEmail.phoneNumber
      );
      req.session = { jwt: accessToken };
      //console.log('session', req.session);
      return res.status(201).send({
        success: true,
        accessToken: accessToken,
        refreshToken: newRefreshToken,
      });
    } else if (existingPhone) {
      const accessToken = await JwtService.accessToken({
        email: existingPhone.email,
        id: existingPhone.id,
        phoneNumber: existingPhone.phoneNumber,
        type: PayloadType.AdminType,
      });
      const newRefreshToken = await AdminDatase.updateRefreshToken(
        existingPhone.id,
        existingPhone.email,
        existingPhone.phoneNumber
      );
      req.session = { jwt: accessToken, refreshToken: newRefreshToken };
      //console.log('session', req.session);
      return res.status(201).send({
        success: true,
        accessToken: accessToken,
        refreshToken: newRefreshToken,
      });
    }
  }

  static async addAdmin(req: Request, res: Response) {
    const { email, phoneNumber } = req.body;
    var exitstingPhone: any;
    var existingUser: any;

    if (email != undefined || email != null) {
      existingUser = await AdminDatase.isExistingEmail(email);
    }

    if (phoneNumber != undefined || phoneNumber != null) {
      exitstingPhone = await AdminDatase.isExistingPhone(phoneNumber);
    }

    if (existingUser) {
      throw new BadRequestError('Email In Use');
    }

    if (exitstingPhone) {
      throw new BadRequestError('Phone is Already in use');
    }

    var user = await AdminDatase.addAdminUser(req);
    return res.status(201).send(user);
  }

  static async addNewUser(req: Request, res: Response) {
    const { email, phoneNumber } = req.body;
    var exitstingPhone: any;
    var existingUser: any;

    if (email != undefined || email != null) {
      existingUser = await AdminDatase.isExistingEmail(email);
    }

    if (phoneNumber != undefined || phoneNumber != null) {
      exitstingPhone = await AdminDatase.isExistingPhone(phoneNumber);
    }

    if (existingUser) {
      throw new BadRequestError('Email In Use');
    }

    if (exitstingPhone) {
      throw new BadRequestError('Phone is Already in use');
    }

    var user = await AdminDatase.addNewUser(req);
    return res.status(201).send(user);
  }

  static async getUserById(req: Request, res: Response) {
    var user = await AdminDatase.getUserById(req);
    if (!user) {
      throw new BadRequestError('User does not exist');
    }
    res.status(200).send(user);
  }

  static async getAdminRoles(req: Request, res: Response) {
    var user = await AdminDatase.getAdminRoles(req);
    if (!user) {
      throw new BadRequestError('User does not exist');
    }
    res.status(200).send(user);
  }

  static async getAdminRolesList(req: Request, res: Response) {
    var list = await AdminDatase.getAdminRolesList(req);
    res.status(200).send(list);
  }

  static async updateAdminRole(req: Request, res: Response) {
    const data = await AdminDatase.updateAdminRole(req);
    res.status(200).send(data);
  }

  static async getAdminList(req: Request, res: Response) {
    const data = await AdminDatase.getAdminList(req);
    res.status(200).send(data);
  }
  static async getAdminByStatus(req: Request, res: Response) {
    const data = await AdminDatase.getAdminByStatus(req);
    res.status(200).send(data);
  }

  static async statusUpdateForAdmin(req: Request, res: Response) {
    var data = await AdminDatase.statusUpdateForAdmin(req);
    res.status(200).send(data);
  }

  static async getAdminByName(req: Request, res: Response) {
    var data = await AdminDatase.getAdminByName(req);
    res.status(200).send({
      success: true,
      data: data,
    });
  }
}
