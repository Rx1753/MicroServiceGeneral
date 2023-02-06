import mongoose, { ObjectId } from 'mongoose';

// intetface that describe the prooerties
// that are required to cretae new user
export interface CustomerAttrs {
  userName: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phoneNumber?: string | null;
  countryCode?: string | null;
  password: string;
  inviteCode: string;
  referralId?: string;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  gender: string;
  dob: Date;
}

// interface for usermodel pass
interface CustomerModel extends mongoose.Model<CustomerDoc> {
  build(attrs: CustomerAttrs): CustomerDoc;
}

// interface for single user properties
export interface CustomerDoc extends mongoose.Document {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  password: string;
  isMFA: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  imageUrl: string;
  isActive: boolean;
  rewardPoint: number;
  inviteCode: string;
  referralId: CustomerDoc; // userId
  refreshToken: string;
  gender: string;
  dob: Date;
  isDeletedAccount: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const customerSchema = new mongoose.Schema(
  {
    userName: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String || null },
    phoneNumber: { type: String || null },
    countryCode: { type: String || null },
    password: { type: String, required: true },
    isMFA: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    imageUrl: { type: String, default: null },
    isActive: { type: Boolean, default: true }, //for status
    rewardPoint: { type: Number, default: 0 },
    inviteCode: { type: String, required: true, unique: true },
    referralId: { type: String, default: null, ref: 'Customer' },
    refreshToken: { type: String },
    gender: { type: String },
    dob: { type: Date },
    isDeletedAccount: { type: Boolean, default: false }, // delete account
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.customerId = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
      },
    },
    timestamps: true,
  }
);

// customerSchema.pre('save', async function (done) {
//   if (this.isModified('password')) {
//     const hased = await Password.toHash(this.get('password'));
//     this.set('password', hased);
//   }
//   done();
// });

// customerSchema.pre('update', async function (done) {
//     const currentDate = new Date();
//     const updated_at = currentDate.getTime();
//     this.set('updated_at', updated_at);
//     done();
// })

customerSchema.statics.build = (attrs: CustomerAttrs) => {
  return new Customer(attrs);
};

const Customer = mongoose.model<CustomerDoc, CustomerModel>(
  'Customer',
  customerSchema
);

export { Customer };
