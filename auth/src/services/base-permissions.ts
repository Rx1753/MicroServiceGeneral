import { AdminDatabase } from '../database-layer/admin-data-layer';
import { AdminRole } from '../models/admin-role';
import { AdminPermissions } from '../models/admin-permissions';
import { AdminRoleMapping } from '../models/admin-role-mapping';
import {
  AdminPermissionsAttrs,
  PermissionNameEnum,
} from '../models/admin-permissions';

class BasePermisson {
  static async createBasePermissonsAndRoles() {
    const tableCheck = await AdminPermissions.findOne({
      $and: [
        {
          tableName:
            PermissionNameEnum[PermissionNameEnum.adminPanelPermissions],
        },
        { isCreate: true },
        { isUpdate: true },
        { isDelete: true },
        { isRead: true },
      ],
    });

    if (!tableCheck) {
      const data: AdminPermissionsAttrs = {
        tableName: PermissionNameEnum[PermissionNameEnum.adminPanelPermissions],
        isCreate: true,
        isDelete: true,
        isUpdate: true,
        isRead: true,
      };
      var isPermissionAdded = await AdminDatabase.addPermission(data);
      var permissions = [];
      permissions.push(isPermissionAdded.id);
      var role = await this.createRole('Super Admin', permissions);
      var role = await this.createRole('Admin', permissions);
      console.log(
        `Permissions and role added on launch for SuperAdmin & Admin`
      );
    } else {
      console.log(`Permissions and role already created`);
    }
  }

  static async createRole(roleName: string, permissionId: any) {
    const isRoleExists: any = await AdminRole.findOne({
      name: roleName,
    });
    if (!isRoleExists) {
      await Promise.all(
        permissionId.map(async (e: any) => {
          const permissionCheck = await AdminPermissions.findById(e);
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
  }
}

export { BasePermisson };
