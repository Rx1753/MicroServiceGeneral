import mongoose, { ObjectId } from 'mongoose';

// intetface that describe the prooerti
// that are required to cretae new user
export interface CountryAttrs {
  countryName: string;
}

// interface for usermodel pass
interface CountryModel extends mongoose.Model<CountryDoc> {
  build(attrs: CountryAttrs): CountryDoc;
}

// interface for single user properties
export interface CountryDoc extends mongoose.Document {
  countryName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const countrySchema = new mongoose.Schema(
  {
    countryName: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.countryId = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

countrySchema.statics.build = (attrs: CountryAttrs) => {
  return new Country(attrs);
};

const Country = mongoose.model<CountryDoc, CountryModel>(
  'Country',
  countrySchema
);

export { Country };
