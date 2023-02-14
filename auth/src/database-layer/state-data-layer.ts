import { BadRequestError } from '@rx-projects/common';
import { Country } from '../models/country';
import { State } from '../models/state';

export class StateDatabaseLayer {
  static async createState(req: any) {
    const { stateName, countryId } = req.body;
    try {
      const countryCheck = await Country.findOne({
        $and: [{ _id: countryId }, { isActive: true }],
      });

      if (countryCheck) {
        const isStateExist = await State.findOne({
          stateName: stateName,
          countryId: countryId,
        });

        if (isStateExist) {
          throw new BadRequestError(
            `state already exists with isActive : ${isStateExist.isActive}`
          );
        }

        const data = State.build({
          stateName: stateName,
          countryId: countryCheck._id,
        });
        await data.save();
        return data;
      } else {
        throw new BadRequestError('invalid country id');
      }
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async updateState(req: any, id: string) {
    const { stateName, countryId, isActive } = req.body;
    try {
      const countryCheck = await Country.findOne({
        $and: [{ _id: countryId }, { isActive: true }],
      });
      if (countryCheck) {
        const stateExistCheck = await State.findById(id);
        if (stateExistCheck) {
          console.log(`updateState :: `);

          await State.findByIdAndUpdate(id, {
            stateName: stateName,
            countryId: countryId,
            isActive: isActive,
          });
          return;
        } else {
          throw new BadRequestError('invalid state id');
        }
      } else {
        throw new BadRequestError('invalid country id');
      }
    } catch (err: any) {
      console.log(err.message);
      throw new BadRequestError(err.message);
    }
  }

  static async deleteState(id: string) {
    try {
      const stateData = await State.findById(id);
      if (!stateData) {
        throw new BadRequestError("state doesn't exists");
      }
      await State.findByIdAndUpdate(id, { isActive: false });
    } catch (err: any) {
      console.log(err.message);
      throw new BadRequestError(err.message);
    }
  }

  static async getStateList(req: any) {
    const data = await State.find().populate('countryId');
    return data;
  }
  static async getListBystatus(req: any) {
    const data = await State.find({ isActive: req.query.isActive }).populate(
      'countryId'
    );
    return data;
  }

  static async getStateByName(req: any) {
    console.log(`stateName :: ${req.query?.stateName}`);
    const data = await State.find({
      isActive: true,
      stateName: { $regex: req.query?.stateName, $options: 'i' },
    });
    return data;
  }
}
