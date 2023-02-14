import { BadRequestError } from '@rx-projects/common';
import { City } from '../models/city';
import { State } from '../models/state';

export class CityDatabaseLayer {
  static async createCity(req: any) {
    const { cityName, stateId } = req.body;
    try {
      const stateCheck = await State.findOne({
        $and: [{ _id: stateId }, { isActive: true }],
      });

      if (stateCheck) {
        const isCityExist = await City.findOne({
          cityName: cityName,
          stateId: stateId,
        });

        if (isCityExist) {
          throw new BadRequestError(
            `city already exists with isActive : ${isCityExist.isActive}`
          );
        }
        const data = City.build({
          cityName: cityName,
          stateId: stateId,
        });
        await data.save();
        return data;
      } else {
        throw new BadRequestError('invalid state id');
      }
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async updateCity(req: any, id: string) {
    const { cityName, stateId, isActive } = req.body;
    try {
      const isStateExist = await State.findOne({
        $and: [{ _id: stateId }, { isActive: true }],
      });
      if (isStateExist) {
        const isCityExist = await City.findById(id);
        if (isCityExist) {
          await City.findByIdAndUpdate(id, {
            cityName: cityName,
            stateId: stateId,
            isActive: isActive,
          });
          return;
        } else {
          throw new BadRequestError('invalid city id');
        }
      } else {
        throw new BadRequestError('invalid state id');
      }
    } catch (err: any) {
      console.log(err.message);
      throw new BadRequestError(err.message);
    }
  }

  static async deleteCity(id: string) {
    try {
      const isCityExist = await City.findById(id);
      if (!isCityExist) {
        throw new BadRequestError("city doesn't exists");
      }
      await City.findByIdAndUpdate(id, { isActive: false });
    } catch (err: any) {
      console.log(err.message);
      throw new BadRequestError(err.message);
    }
  }

  static async getCityList(req: any) {
    const data = await City.find().populate('stateId');
    return data;
  }
  static async getListBystatus(req: any) {
    const data = await City.find({ isActive: req.query.isActive }).populate(
      'stateId'
    );
    return data;
  }

  static async getCityByName(req: any) {
    console.log(`cityName :: ${req.query?.cityName}`);
    const data = await City.find({
      isActive: true,
      cityName: { $regex: req.query?.cityName, $options: 'i' },
    });
    return data;
  }
}
