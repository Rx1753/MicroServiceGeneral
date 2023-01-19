import { AdminDatase } from '../database-layer/admin-data-layer';
import { Request, Response } from 'express-serve-static-core';
import { BadRequestError } from '@rx-projects/common';
import { AdminPermissionsAttrs } from '../models/admin-permissions';
import { AdminRoleAttrs } from '../models/admin-role';

export class AdminDomain {
  static async addPermissions(req: Request, res: Response) {
    const data: AdminPermissionsAttrs = req.body;
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
}
