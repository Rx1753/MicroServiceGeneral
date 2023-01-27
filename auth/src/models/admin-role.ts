import mongoose from 'mongoose';

// An interface that describe the properties
// that are required to create AdminRole
export interface AdminRoleAttrs {
  name: string;
  createdAt?:any;
  updatedAt?:any;
}

// An interface that describe the properties
// that AdminRole document has
export interface AdminRoleDoc extends mongoose.Document {
  name: string;
  createdAt?:any;
  updatedAt?:any;
}

// An interface that describe the properties
// that AdminRole model has
interface AdminRoleModel extends mongoose.Model<AdminRoleDoc> {
  build(attrs: AdminRoleAttrs): AdminRoleDoc;
}

// Schema
const AdminRoleSchema = new mongoose.Schema(
  {
    name: { type: String },
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

// This is middleware function
// AdminRoleSchema.pre('update', async function (done) {
//   const currentDate = new Date();
//   const updatedAt = currentDate.getTime();
//   this.set('updatedAt', updatedAt);
//   done();
// });

// Adding statics property in schema
AdminRoleSchema.statics.build = (attrs: AdminRoleAttrs) => {
  return new AdminRole(attrs);
};

// Model
const AdminRole = mongoose.model<AdminRoleDoc, AdminRoleModel>(
  'AdminRole',
  AdminRoleSchema
);

export { AdminRole };
