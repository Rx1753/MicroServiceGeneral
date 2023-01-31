import { Country } from '../models/country';
import { BadRequestError } from '@rx-projects/common';

export class CountryDatabaseLayer {
  static async createCountry(req: any) {
    const { countryName } = req.body;
    try {
      const checkDataExist = await Country.findOne({
        countryName: countryName,
      });

      if (checkDataExist) {
        throw new BadRequestError(
          `country already exists with isActive : ${checkDataExist.isActive}`
        );
      }
      const data = Country.build({ countryName: countryName });
      await data.save();
      return data;
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async updateCountry(req: any, id: string) {
    try {
      const data = await Country.findById(id);
      if (data) {
        await Country.findByIdAndUpdate(id, {
          countryName: req.body.countryName,
          isActive: req.body.isActive,
        });
      } else {
        throw new BadRequestError("id doesn't exist");
      }
    } catch (err: any) {
      console.log(err.message);
      throw new BadRequestError(err.message);
    }
  }

  static async deleteCountry(id: string) {
    try {
      const countryData = await Country.findById(id);
      if (countryData) {
        if (countryData.isActive) {
          await Country.findByIdAndUpdate(id, { isActive: false });
        } else {
          throw new BadRequestError('id is deleted already');
        }
      } else {
        throw new BadRequestError("id doesn't exist");
      }
    } catch (err: any) {
      console.log(err.message);
      throw new BadRequestError(err.message);
    }
  }

  static async getCountryList(req: any) {
    const data = await Country.aggregate([
      { $addFields: { currentCountryId: { $toString: '$_id' } } },
      {
        $lookup: {
          from: 'states',
          localField: 'currentCountryId',
          foreignField: 'countryId',
          as: 'states',
        },
      },
    ]);
    return data;
  }

  static async getCountryByStatus(req: any) {
    const data = await Country.find({ isActive: req.query.isActive });
    return data;
  }

  static async getCountryByName(req: any) {
    //search by countryName
    const data = await Country.find({
      isActive: true,
      countryName: { $regex: req.query?.countryName, $options: 'i' },
    });
    return data;
  }
}
