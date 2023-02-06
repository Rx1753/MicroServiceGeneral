import mongoose from 'mongoose';

// An interface that describe the properties
// that are required to create OtpCode
interface otpAttrs {
  type: string;
  phoneNumber?: string;
  email?: string;
  userId?: string;
  code: String;
  expirationTime?: Date;
  createdAt?: any;
  updatedAt?: any;
}

// An interface that describe the properties
// that OtpCode document has
interface otpCodeDoc extends mongoose.Document {
  type: string;
  phoneNumber: string;
  email: string;
  userId: string;
  code: String;
  createdBy: string;
  expirationTime: Date;
  createdAt?: any;
  updatedAt?: any;
}

// An interface that describe the properties
// that OtpCode model has
interface otpCodeModel extends mongoose.Model<otpCodeDoc> {
  build(attrs: otpAttrs): otpCodeDoc;
}

// Schema
const otpCodeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['customer', 'business', 'admin', 'email', 'phone'],
    },
    userId: { type: String },
    phoneNumber: { type: String },
    email: { type: String },
    code: { type: String },
    isUsed: { type: Boolean, defaul: false },
    expirationTime: { type: Date },
    createdBy: { type: String },
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
otpCodeSchema.statics.build = (attrs: otpAttrs) => {
  return new OtpCode(attrs);
};

// Model
const OtpCode = mongoose.model<otpCodeDoc, otpCodeModel>(
  'OtpCode',
  otpCodeSchema
);

export { OtpCode };
