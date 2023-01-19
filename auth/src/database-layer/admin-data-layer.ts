import { Admin, AdminAttrs } from '../models/admin';
import { BadRequestError } from '@rx-projects/common';
import { Password } from '../services/password';
import {
  AdminPermissionsAttrs,
  AdminPermissions,
} from '../models/admin-permissions';
import { Request } from 'express';
import { AdminRoleMapping } from '../models/admin-role-mapping';
import { AdminRoleAttrs, AdminRole } from '../models/admin-role';

export class AdminDatase {
  static async addPermission(data: AdminPermissionsAttrs) {
    const permission = AdminPermissions.build(data);
    await permission.save();
    return permission;
  }

  static async createRole(req: Request) {
    const { roleName, permissionId } = req.body;

    const data = AdminRole.build({ name: roleName });
    await data.save();
    await Promise.all(
      permissionId.map(async (e: any) => {
        const permissionCheck = await AdminPermissions.findById(e);
        if (!permissionCheck) {
          throw new BadRequestError('Data not found');
        }
      })
    );

    await Promise.all(
      permissionId.map(async (e: any) => {
        const roleMappingData = AdminRoleMapping.build({
          roleId: data.id,
          permissionId: e,
        });
        await roleMappingData.save();
      })
    );
    return data;
  }

  static async isExistingEmail(email: String) {
    const existingEmail: any = await Admin.findOne({
      $and: [{ email: email }, { isActive: true }],
    });
    return existingEmail;
  }

  static async isExistingPhone(phoneNumber: Number) {
    const existingPhone: any = await Admin.findOne({
      $and: [{ phoneNumber: phoneNumber }, { isActive: true }],
    });
    return existingPhone;
  }

  static async addAdminUser(req: any) {
    try {
      const {
        userName,
        email,
        password,
        phoneNumber,
        isAllowChangePassword,
        roleId,
      } = req.body;
      const roleCheck = await AdminRole.findById(roleId);
      if (!roleCheck) {
        throw new BadRequestError('Invalid role id');
      }

      var user: AdminAttrs;
      const hashPassword = await Password.toHash(password);

      user = {
        userName: userName,
        password: hashPassword,
        allowChangePassword: isAllowChangePassword,
        roleId: roleId,
      };
      if (
        req.body.phoneNumber == null &&
        req.body.phoneNumber == undefined &&
        req.body.email != null &&
        req.body.email != undefined
      ) {
        console.log('sign up with email');
        user.email = email;
        user.phoneNumber = null;
      }

      if (
        req.body.phoneNumber != null &&
        req.body.phoneNumber != undefined &&
        req.body.email == null &&
        req.body.email == undefined
      ) {
        console.log('sign up with phone no');
        user.phoneNumber = phoneNumber;
        user.email = null;
      }

      if (
        req.body.phoneNumber != null &&
        req.body.phoneNumber != undefined &&
        req.body.email != null &&
        req.body.email != undefined
      ) {
        user.phoneNumber = phoneNumber;
        user.email = email;
      }

      const adminData = Admin.build(user);
      await adminData.save();
      //Triggers for Email/Phone Sign up
      if (user.email != null) {
        //TODO email trigger
      } else {
        //TODO sms trigger
      }
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }
}
