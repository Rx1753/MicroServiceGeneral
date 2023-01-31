import mongoose, { ObjectId } from 'mongoose';
import { StateDoc } from './state';

// intetface that describe the prooerti
// that are required to cretae new user
export interface CityAttrs {
  cityName: string;
  stateId: string;
}

// interface for usermodel pass
interface CityModel extends mongoose.Model<CityDoc> {
  build(attrs: CityAttrs): CityDoc;
}

// interface for single user properties
export interface CityDoc extends mongoose.Document {
  cityName: string;
  stateId: StateDoc;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const citySchema = new mongoose.Schema(
  {
    cityName: { type: String, required: true, unique: true },
    stateId: { type: String, ref: 'State' },
    isActive: { type: Boolean, default: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.cityId = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

citySchema.statics.build = (attrs: CityAttrs) => {
  return new City(attrs);
};

const City = mongoose.model<CityDoc, CityModel>('City', citySchema);

export { City };
