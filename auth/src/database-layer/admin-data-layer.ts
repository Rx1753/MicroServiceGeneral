import { Admin, AdminAttrs } from '../models/admin';
import { BadRequestError } from '@rx-projects/common';
import { Password } from '../services/password';
import {
  AdminPermissionsAttrs,
  AdminPermissions,
  PermissionNameEnum,
} from '../models/admin-permissions';
import { Request } from 'express';
import { AdminRoleMapping } from '../models/admin-role-mapping';
import { AdminRoleAttrs, AdminRole } from '../models/admin-role';
import { JwtService } from '../services/jwt';
import { PayloadType } from '../services/string-values';
import { OtpCode } from '../models/otp-code';
import { CodeGenerator } from '../services/otp';
import { Common } from '../services/common';
import { MailService } from '../services/mail-service';
import { HtmlTemplate } from '../services/html-templates';
import { SendSmsService } from '../services/send-sms-service';

export class AdminDatabase {
  static async checkPermissionExist(data: AdminPermissionsAttrs) {
    const isPermissionExistWithTN: any = await AdminPermissions.findOne({
      tableName: data.tableName,
      isRead: data.isRead,
      isUpdate: data.isUpdate,
      isDelete: data.isDelete,
      isCreate: data.isCreate,
    });
    return isPermissionExistWithTN;
  }

  static async addPermission(data: AdminPermissionsAttrs) {
    const permission = AdminPermissions.build(data);
    await permission.save();
    return permission;
  }

  static async createRole(roleName: string, permissionId: any) {
    const isRoleExists: any = await AdminRole.findOne({
      name: roleName,
    });
    if (isRoleExists) {
      throw new BadRequestError('Role already defined');
    }
    await Promise.all(
      permissionId.map(async (e: any) => {
        const permissionCheck = await AdminPermissions.findById(e);
        if (!permissionCheck) {
          throw new BadRequestError('Permission not found');
        }
      })
    );
    const data = AdminRole.build({ name: roleName });
    await data.save();
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

  static async updateRolePermissions(req: Request) {
    const { roleId, permissionId } = req.body;
    const isRoleExists: any = await AdminRole.findById(roleId);
    if (!isRoleExists) {
      throw new BadRequestError("Role doesn't exists to update");
    }
    // Check permission exist or not in db
    await Promise.all(
      permissionId.map(async (e: any) => {
        const permissionCheck = await AdminPermissions.findById(e);
        if (!permissionCheck) {
          throw new BadRequestError('Permission not found');
        }
      })
    );
    var getAllPermissionsData = await AdminRoleMapping.find({ roleId: roleId });
    if (getAllPermissionsData != null) {
      console.log(`Delete permissions for Role Id :: ${roleId}`);
      await AdminRoleMapping.deleteMany({ roleId: roleId });
    }
    // Update new permissions for Roles
    await Promise.all(
      permissionId.map(async (e: any) => {
        const roleMappingData = AdminRoleMapping.build({
          roleId: roleId,
          permissionId: e,
        });
        await roleMappingData.save();
      })
    );
    return isRoleExists;
  }

  static async isExistingEmail(email: String) {
    const existingEmail: any = await Admin.findOne({
      $and: [{ email: email }, { isActive: true }],
    });
    return existingEmail;
  }

  static async isExistingPhone(phoneNumber: Number, countryCode: Number) {
    const existingPhone: any = await Admin.findOne({
      $and: [
        { phoneNumber: phoneNumber },
        { countryCode: countryCode },
        { isActive: true },
      ],
    });
    return existingPhone;
  }

  static async isAdminExist(id: String) {
    var isUserExist = await Admin.findOne({
      $and: [{ _id: id }, { isActive: true }],
    });
    return isUserExist;
  }

  static async checkPassword(existingPassword: string, password: string) {
    return await Password.compare(existingPassword, password);
  }

  static async addAdminUser(req: any) {
    try {
      const adminDataUser = await Admin.findById({ _id: req.currentUser.id });
      if (adminDataUser?.isSuperAdmin) {
        return await this.addUserToAdminTable(req);
      } else {
        throw new BadRequestError(
          'Permission Denied! Only SuperAdmin can create admin'
        );
      }
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async addNewUser(req: any) {
    try {
      var isCreatePermissionAllow = await this.isCreatePermissionAllow(
        req.currentUser.id
      );
      if (isCreatePermissionAllow) {
        console.log(`currentUser :: Role name ::-> ${req.currentUser.id}`);
        return await this.addUserToAdminTable(req);
      } else {
        throw new BadRequestError(
          'Permission denied! You have no rights to create a new user'
        );
      }
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async addUserToAdminTable(req: any) {
    const {
      userName,
      email,
      password,
      phoneNumber,
      isAllowChangePassword,
      roleId,
      countryCode,
      rolesArray,
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
      countryCode: countryCode,
    };
    if (
      phoneNumber == null &&
      phoneNumber == undefined &&
      email != null &&
      email != undefined
    ) {
      user.email = email;
      user.phoneNumber = null;
      user.countryCode = null;
      console.log('sign up with email');
    } else if (
      phoneNumber != null &&
      phoneNumber != undefined &&
      email == null &&
      email == undefined
    ) {
      user.phoneNumber = phoneNumber;
      user.countryCode = countryCode;
      user.email = null;
      console.log('sign up with phone no');
    } else if (
      phoneNumber != null &&
      phoneNumber != undefined &&
      email != null &&
      email != undefined
    ) {
      user.phoneNumber = phoneNumber;
      user.countryCode = countryCode;
      user.email = email;
    }
    //Role permission logic
    const roleDataArr: string[] = [];
    rolesArray.forEach((e: any) => {
      if (!roleDataArr.includes(e.tableName)) {
        roleDataArr.push(e.tableName);
      } else {
        throw new BadRequestError('Repeating table is not possible');
      }
    });
    var permissionRoleId: { _id: string }[] = [];
    await Promise.all(
      rolesArray.map(async (e: any) => {
        const permissionRoleMap = await this.checkRoleMapping(
          e.tableName,
          e.isCreate,
          e.isUpdate,
          e.isDelete,
          e.isRead
        );
        permissionRoleId.push(permissionRoleMap);
        const roleMappingData = AdminRoleMapping.build({
          roleId: roleId,
          permissionId: permissionRoleMap._id,
        });
        await roleMappingData.save();
      })
    );
    console.log(`permissionRoleId :: ${JSON.stringify(permissionRoleId)}`);
    const adminData = Admin.build(user);
    adminData.createdBy = req.currentUser.id;
    await adminData.save();
    //Triggers for Email/Phone Sign up
    if (user.email != null) {
      //TODO email trigger
      var htmlTemplate = HtmlTemplate.sendEmailWithCredentials(
        userName,
        email,
        password
      );
      await MailService.mailTrigger(
        user.email,
        'Admin Credentials',
        htmlTemplate
      );
    } else {
      //TODO sms trigger
      var content = `Hello, ${userName}, Credentials to login Domain name \n PhoneNumber : ${phoneNumber}, \n Password: ${password}`;
      await SendSmsService.sendSms(content, user.phoneNumber!.toString());
    }
    return adminData;
  }

  static async checkRoleMapping(
    tableName: string,
    isCreate: boolean,
    isUpdate: boolean,
    isDelete: boolean,
    isRead: boolean
  ) {
    try {
      tableName = tableName.toLowerCase();
      const tableCheck = await AdminPermissions.findOne({
        $and: [
          { tableName: tableName },
          { isCreate: isCreate },
          { isUpdate: isUpdate },
          { isDelete: isDelete },
          { isRead: isRead },
        ],
      });
      if (!tableCheck) {
        const permission = AdminPermissions.build({
          tableName: tableName,
          isRead: isRead,
          isCreate: isCreate,
          isDelete: isDelete,
          isUpdate: isUpdate,
        });
        await permission.save();
        return { _id: permission.id.toString() };
      } else {
        return { _id: tableCheck.id.toString() };
      }
    } catch (err: any) {
      throw new BadRequestError(err.message);
    }
  }

  static async getUserById(req: Request) {
    var data = await Admin.findOne({ _id: req.params.id });
    if (data) {
      var role = await AdminRole.findById({ _id: data.roleId });
      const resData = JSON.parse(JSON.stringify(data));
      const roleData = await AdminRoleMapping.find({
        roleId: data.roleId,
      }).populate('permissionId');
      if (roleData) {
        resData.roleName = role?.name;
        resData.permission = roleData;
        return resData;
      } else {
        resData.roleName = role?.name;
        return resData;
      }
    } else {
      throw new BadRequestError("id doesn't exist");
    }
  }

  static async getAdminRoles(req: Request) {
    console.log(`getAdminRoles ------>>>`);
    const data = await AdminRole.aggregate([
      {
        $match: {
          $expr: { $eq: ['$_id', { $toObjectId: `${req.params.id}` }] },
        },
      },
      { $addFields: { rId: { $toString: '$_id' } } },
      {
        $lookup: {
          from: 'adminrolemappings',
          localField: 'rId',
          foreignField: 'roleId',
          as: 'permissions',
        },
      },
      {
        $unwind: {
          path: '$permissions',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          permissionObjId: { $toObjectId: '$permissions.permissionId' },
        },
      },
      {
        $lookup: {
          from: 'adminpermissions',
          localField: 'permissionObjId',
          foreignField: '_id',
          as: 'permissions.data',
        },
      },
      {
        $unwind: {
          path: '$permissions.data',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          roleName: { $first: '$name' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          permissions: { $push: '$permissions.data' },
        },
      },
    ]);
    return data.length > 0 ? data[0] : [];
  }

  static async getAdminRolesList() {
    const data = await AdminRole.aggregate([
      { $addFields: { rId: { $toString: '$_id' } } },
      {
        $lookup: {
          from: 'adminrolemappings',
          localField: 'rId',
          foreignField: 'roleId',
          as: 'permissions',
        },
      },
      {
        $unwind: {
          path: '$permissions',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          permissionObjId: { $toObjectId: '$permissions.permissionId' },
        },
      },
      {
        $lookup: {
          from: 'adminpermissions',
          localField: 'permissionObjId',
          foreignField: '_id',
          as: 'permissions.data',
        },
      },
      {
        $unwind: {
          path: '$permissions.data',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          roleName: { $first: '$name' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          permissions: { $push: '$permissions.data' },
        },
      },
    ]);
    return data;
  }

  static async updateAdminRole(req: any) {
    const roleId = req.body.roleId;
    var isSuperAdmin = await Admin.findById(req.currentUser.id);
    if (!isSuperAdmin) {
      throw new BadRequestError(
        'Permission denied! Only Superadmin can update the roles'
      );
    }
    var checkRoleExist = await AdminRole.findById(roleId);
    if (!checkRoleExist) {
      throw new BadRequestError("Role doesn't exist for this role id");
    }
    await Admin.findByIdAndUpdate(req.body.id, { roleId: roleId });
    const adminData = await Admin.findById(req.body.id);
    return adminData;
  }

  // create new token in admin user
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
      PayloadType.AdminType
    );
    return accessToken;
  }
  // update refresh token in admin user
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
      PayloadType.AdminType
    );
    const admin = await Admin.findByIdAndUpdate(id, {
      refreshToken: refreshToken,
    });
    return refreshToken;
  }

  static async getPermissions(req: any) {
    var result;
    if (req.query?.pageNo == null && req.query?.limit == null) {
      //Without pagination
      const totalData = await AdminPermissions.find();
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
      const totalData = await AdminPermissions.find();
      console.log(
        `pageNo : ${pageNo} , limit : ${limit} , skip :: ${skip}, totalCount : ${totalData.length} `
      );
      var data = await AdminPermissions.find().skip(skip).limit(limit);

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

  static async getAdminList(req: any) {
    var result;
    if (req.query?.pageNo == null && req.query?.limit == null) {
      //Without pagination
      const totalData = await Admin.find({
        isActive: true,
        isSuperAdmin: false,
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
      const totalData = await Admin.find({
        isActive: true,
        isSuperAdmin: false,
      });
      console.log(
        `pageNo : ${pageNo} , limit : ${limit} , skip :: ${skip}, totalCount : ${totalData.length} `
      );
      var data = await Admin.find({ isActive: true, isSuperAdmin: false })
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

  static async getAdminByStatus(req: Request) {
    //TODO : fetch admins list with isActive status
    console.log(`Admin query ${JSON.stringify(req.query)}`);
    var adminData;
    if (req.query?.isSuperAdmin && req.query != null) {
      // if isSuperAdmin = false,
      adminData = await Admin.find({
        isActive: req.query.isActive,
        isSuperAdmin: req.query.isSuperAdmin,
      });
    } else {
      // fetch all list including super admin
      adminData = await Admin.find({
        isActive: req.query.isActive,
      });
    }
    return adminData;
  }

  static async statusUpdateForAdmin(req: any) {
    const adminData = await Admin.findOne({
      _id: req.currentUser.id,
      isSuperAdmin: true,
    });

    if (adminData) {
      const data = await Admin.findById({ _id: req.params.id });
      if (data && !data?.isSuperAdmin) {
        var status = data.isActive ? false : true;
        await Admin.findByIdAndUpdate(req.params.id, { isActive: status });
        return {
          success: true,
          msg: 'Status updated successfully',
          isActive: status,
          id: data.id,
        };
      } else {
        throw new BadRequestError('Invalid user id');
      }
    } else {
      throw new BadRequestError(
        'Permission denied! Only super admin can set the active status of admin'
      );
    }
  }

  static async getAdminByName(req: any) {
    console.log(`getAdminByName :: ${req.query?.userName}`);
    if (
      req.query?.userName &&
      req.query?.userName != null &&
      req.query?.userName != ''
    ) {
      //search by userName
      const data = await Admin.find({
        isActive: true,
        userName: { $regex: req.query?.userName, $options: 'i' },
      });
      return data;
    } else {
      //give list on empty userName
      const data = await Admin.find({
        isActive: true,
      });
      return data;
    }
  }

  static async forgotPasswordMailTrigger(req: Request) {
    try {
      const { email } = req.body;
      const emailData = await Admin.findOne({ email: email });
      if (!emailData) {
        throw new BadRequestError("Email doesn't exists");
      }
      if (emailData.allowChangePassword) {
        //Generate OTP
        const code = CodeGenerator.getOtp();
        const expirationTime = Common.addSecondsToDate(60);
        var isOtpExists = await OtpCode.findOne({
          type: 'email',
          email: email,
        });
        //Send email than save it to db
        var htmlTemplate = HtmlTemplate.sendOtpOnForgotPassword(
          emailData.userName,
          code
        );
        await MailService.mailTrigger(email, 'Forgot Password ', htmlTemplate);
        //Create OTP instance in DB
        if (isOtpExists) {
          await OtpCode.findByIdAndUpdate(isOtpExists.id, {
            type: 'email',
            email: email,
            code: code,
            expirationTime: expirationTime,
            userId: emailData.id,
          });
        } else {
          var createVerificationCode = OtpCode.build({
            type: 'email',
            email: email,
            code: code,
            expirationTime: expirationTime,
            userId: emailData.id,
          });
          await createVerificationCode.save();
        }
        console.log(`Email trigged and save it to db :: ${code}`);
        return true;
      }
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async forgotPasswordVerification(req: Request) {
    const { code, password } = req.body;
    const otpCheck = await OtpCode.findOne({ code: code });
    if (!otpCheck) {
      throw new BadRequestError('Invalid Otp');
    }
    var dateNow = new Date();
    console.log(
      `Verify Otp Expiry Date  :: ${otpCheck.expirationTime.toUTCString()}`
    );
    console.log(`Verify Otp Current Date :: ${dateNow.toUTCString()}`);

    if (otpCheck.expirationTime < dateNow) {
      throw new BadRequestError('Opt Expired!');
    }
    const hashed = await Password.toHash(password);
    const newData = await Admin.findOneAndUpdate(
      { email: otpCheck.email },
      { password: hashed }
    );

    if (newData) {
      console.log('password updated');
      //delete otp entry for the forgot password
      await OtpCode.findByIdAndDelete(otpCheck.id);
      req.session = null;
      return { message: 'Password updated' };
    } else {
      throw new BadRequestError('Something went wrong');
    }
  }

  static async changePassword(req: any) {
    const { oldPassword, newPassword } = req.body;
    const checkUser = await AdminDatabase.isAdminExist(req.currentUser?.id);
    if (!checkUser) {
      throw new BadRequestError('user does not exist');
    }
    const verifyPassword = await Password.compare(
      checkUser.password,
      oldPassword
    );
    if (!verifyPassword) {
      throw new BadRequestError('invalid old password');
    }
    const newHashPassword = await Password.toHash(newPassword);
    const refreshToken = await AdminDatabase.updateRefreshToken(
      checkUser.id,
      checkUser.email,
      checkUser.phoneNumber,
      checkUser.countryCode
    );
    const accessToken = await AdminDatabase.createAccessToken(
      checkUser.id,
      checkUser.email,
      checkUser.phoneNumber,
      checkUser.countryCode
    );
    await Admin.findByIdAndUpdate(checkUser.id, {
      password: newHashPassword,
    });
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  static async isCreatePermissionAllow(currentUserId: string) {
    const currentUserData = await Admin.findById({ _id: currentUserId });
    var currentUserRolePermissions = await AdminRoleMapping.aggregate([
      { $match: { roleId: currentUserData?.roleId } },
      {
        $addFields: {
          permissionObjId: { $toObjectId: '$permissionId' },
          roleObjId: { $toObjectId: '$roleId' },
        },
      },
      {
        $lookup: {
          from: 'adminroles',
          localField: 'roleObjId',
          foreignField: '_id',
          as: 'roleData',
        },
      },
      {
        $unwind: '$roleData',
      },
      {
        $lookup: {
          from: 'adminpermissions',
          localField: 'permissionObjId',
          foreignField: '_id',
          as: 'permissionsData',
        },
      },
      {
        $unwind: '$permissionsData',
      },
      {
        $match: {
          'permissionsData.tableName':
            PermissionNameEnum[PermissionNameEnum.adminPanelPermissions],
          'permissionsData.isCreate': true,
        },
      },
    ]);
    if (
      currentUserRolePermissions != null &&
      currentUserRolePermissions.length > 0
    ) {
      console.log(
        `currentUserRolePermissions ::-- ${JSON.stringify(
          currentUserRolePermissions
        )}`
      );
      return currentUserRolePermissions[0];
    } else {
      return null;
    }
  }
}
