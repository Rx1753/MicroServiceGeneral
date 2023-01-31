import mongoose, { ObjectId } from 'mongoose';
import { CountryDoc } from './country';

// intetface that describe the prooerti
// that are required to cretae new user
export interface StateAttrs {
  stateName: string;
  countryId: string;
}

// interface for usermodel pass
interface StateModel extends mongoose.Model<StateDoc> {
  build(attrs: StateAttrs): StateDoc;
}

// interface for single user properties
export interface StateDoc extends mongoose.Document {
  stateName: string;
  countryId: CountryDoc;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const stateSchema = new mongoose.Schema(
  {
    stateName: { type: String, required: true, unique: true },
    countryId: { type: String, ref: 'Country' },
    isActive: { type: Boolean, default: true },
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

stateSchema.statics.build = (attrs: StateAttrs) => {
  return new State(attrs);
};

const State = mongoose.model<StateDoc, StateModel>('State', stateSchema);

export { State };
