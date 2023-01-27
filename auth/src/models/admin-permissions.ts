import mongoose from 'mongoose';

export interface AdminPermissionsAttrs {
  tableName: string;
  isCreate: boolean;
  isDelete: boolean;
  isUpdate: boolean;
  isRead: boolean;
}

export interface AdminPermissionsDoc extends mongoose.Document {
  tableName: string;
  isCreate: boolean;
  isDelete: boolean;
  isUpdate: boolean;
  isRead: boolean;
}

interface AdminPermissionsModel extends mongoose.Model<AdminPermissionsDoc> {
  build(attrs: AdminPermissionsAttrs): AdminPermissionsDoc;
}

// Schema
const adminPermissionSchema = new mongoose.Schema(
  {
    tableName: {
      type: String,
      required: true,
    },
    isCreate: { type: Boolean, required: true, default: true },
    isDelete: { type: Boolean, required: true, default: true },
    isUpdate: { type: Boolean, required: true, default: true },
    isRead: { type: Boolean, required: true, default: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

// Adding statics property in schema
adminPermissionSchema.statics.build = (attrs: AdminPermissionsAttrs) => {
  return new AdminPermissions(attrs);
};

// Model
const AdminPermissions = mongoose.model<
  AdminPermissionsDoc,
  AdminPermissionsModel
>('AdminPermissions', adminPermissionSchema);

export { AdminPermissions };
