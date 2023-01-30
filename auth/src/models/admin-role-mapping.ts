import mongoose from 'mongoose';
import { AdminPermissionsDoc } from './admin-permissions';
import { AdminRoleDoc } from './admin-role';
// An interface that describe the properties
// that are required to create AdminRoleMapping
interface AdminRoleMappingAttrs {
  roleId: string;
  permissionId: string;
}

// An interface that describe the properties
// that AdminRoleMapping document has
interface AdminRoleMappingDoc extends mongoose.Document {
  roleId: AdminRoleDoc;
  permissionId: AdminPermissionsDoc;
}

// An interface that describe the properties
// that AdminRoleMapping model has
interface AdminRoleMappingModel extends mongoose.Model<AdminRoleMappingDoc> {
  build(attrs: AdminRoleMappingAttrs): AdminRoleMappingDoc;
}

// Schema
const AdminRoleMappingSchema = new mongoose.Schema(
  {
    roleId: { type: String, ref: 'AdminRole' },
    permissionId: { type: String, ref: 'AdminPermissions' },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret._id;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

// Adding statics property in schema
AdminRoleMappingSchema.statics.build = (attrs: AdminRoleMappingAttrs) => {
  return new AdminRoleMapping(attrs);
};

// Model
const AdminRoleMapping = mongoose.model<
  AdminRoleMappingDoc,
  AdminRoleMappingModel
>('AdminRoleMapping', AdminRoleMappingSchema);

export { AdminRoleMapping };
