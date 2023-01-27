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
import mongoose from 'mongoose';
import { JwtService } from '../services/jwt';
import { PayloadType } from '../services/string-values';

export class AdminDatase {
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

  static async createRole(req: Request) {
    const { roleName, permissionId } = req.body;

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
      throw new BadRequestError('Create role to update');
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

  static async isExistingPhone(phoneNumber: Number) {
    const existingPhone: any = await Admin.findOne({
      $and: [{ phoneNumber: phoneNumber }, { isActive: true }],
    });
    return existingPhone;
  }

  static async checkPassword(existingPassword: string, password: string) {
    return await Password.compare(existingPassword, password);
  }

  static async addAdminUser(req: any) {
    try {
      const adminDataUser = await Admin.findById({ _id: req.currentUser.id });
      if (adminDataUser?.isSuperAdmin == true) {
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
      const adminDataUser = await Admin.findById({ _id: req.currentUser.id });
      if (adminDataUser) {
        const currentUserRole = await AdminRole.findById(adminDataUser.roleId);
        const roleCheckForNewUser = await AdminRole.findById(req.body.roleId);

        console.log(`currentUser :: Role name :: ${currentUserRole?.name}`);
        console.log(`addNewUser  :: Role name :: ${roleCheckForNewUser?.name}`);
        if (
          roleCheckForNewUser?.name == 'SuperAdmin' ||
          roleCheckForNewUser?.name == 'Admin'
        ) {
          throw new BadRequestError(
            'Permission denied to add role as an Admin/SuperAdmin'
          );
        } else if (
          adminDataUser.isSuperAdmin ||
          currentUserRole?.name == 'Admin'
        ) {
          return await this.addUserToAdminTable(req);
        } else {
          throw new BadRequestError(
            'Permission denied! Only Admin/SuperAdmin can add new user'
          );
        }
      } else {
        throw new BadRequestError('Admin User not found');
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

    //Role permission logic
    const roleData = req.body.rolesArray;
    const roleDataArr: string[] = [];

    roleData.forEach((e: any) => {
      if (!roleDataArr.includes(e.tableName)) {
        roleDataArr.push(e.tableName);
      } else {
        throw new BadRequestError('Repeating table is not possible');
      }
    });

    var permissionRoleId: { _id: string }[] = [];

    await Promise.all(
      roleData.map(async (e: any) => {
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
    } else {
      //TODO sms trigger
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
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new BadRequestError('Requested id is not id type');
    }
    var data = await Admin.findOne({ _id: req.params.id });
    if (data) {
      const roleData = await AdminRoleMapping.find({
        roleId: data.roleId,
      }).populate('permissionId');
      if (roleData) {
        const resData = JSON.parse(JSON.stringify(data));
        resData.permission = roleData;
        return resData;
      }
    } else {
      throw new BadRequestError("id doesn't exist");
    }

    return data;
  }

  static async getAdminRoles(req: Request) {
    const roleData = await AdminRoleMapping.find({
      roleId: req.params.id,
    }).populate('permissionId');
    if (roleData) {
      var role = await AdminRole.findById({ _id: req.params.id });

      var permissionsList: {}[] = [];

      await Promise.all(
        roleData.map(async (e: any) => {
          permissionsList.push(e.permissionId);
        })
      );

      return {
        roleId: req.params.id,
        roleName: role?.name,
        permissions: permissionsList,
      };
    } else {
      throw new BadRequestError(`No Data Found for #${req.params.roleId}`);
    }
  }

  static async getAdminRolesList(req: Request) {
    const list = await AdminRoleMapping.find().populate('permissionId');
    if (list) {
      var roleIdArray: {}[] = [];
      var finalArray: {}[] = [];

      await Promise.all(
        list.map(async (e: any) => {
          if (!roleIdArray.includes(e.roleId)) {
            roleIdArray.push(e.roleId);
            const roleData = await AdminRoleMapping.find({
              roleId: e.roleId,
            }).populate('permissionId');

            if (roleData) {
              var role = await AdminRole.findById({ _id: e.roleId });
              var permissionsList: {}[] = [];
              await Promise.all(
                roleData.map(async (e: any) => {
                  permissionsList.push(e.permissionId);
                })
              );

              finalArray.push({
                roleId: e.roleId,
                roleName: role?.name,
                createdAt: role?.createdAt,
                updatedAt: role?.updatedAt,
                permissions: permissionsList,
              });
              console.log(
                `ROLE ID :: ${e.roleId} :: Permissions :: ${permissionsList.length}`
              );
            }
          }
        })
      );
      return {
        data: list,
      };
    } else {
      throw new BadRequestError(`No Data Found for #${req.params.roleId}`);
    }
  }

  static async updateAdminRole(req: Request) {
    const roleId = req.body.roleId;
    var checkRoleExist = await AdminRole.findById(roleId);
    if (!checkRoleExist) {
      throw new BadRequestError("Role doesn't exist for this role id");
    }

    await Admin.findByIdAndUpdate(req.body.id, { roleId: roleId });

    const adminData = await Admin.findById(req.body.id);
    return adminData;
  }

  // update refresh token in admin user
  static async updateRefreshToken(
    id: string,
    email: string,
    phoneNumber: Number
  ) {
    const refreshToken = await JwtService.refreshToken({
      email: email,
      id: id,
      phoneNumber: phoneNumber,
      type: PayloadType.AdminType,
    });
    const admin = await Admin.findByIdAndUpdate(id, {
      refreshToken: refreshToken,
    });
    return admin?.refreshToken;
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
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new BadRequestError('Invalid id');
    }
    const adminData = await Admin.findOne({
      _id: req.currentUser.id,
      isSuperAdmin: true,
    });

    if (adminData) {
      const data = await Admin.findById({ _id: req.params.id });
      if (data) {
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
}
