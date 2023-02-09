import { BadRequestError } from '@rx-projects/common';
import mongoose from 'mongoose';
import { City } from '../models/city';
import { Country } from '../models/country';
import { customerAddress } from '../models/customer-address';
import { State } from '../models/state';

export class CustomerAddressDatabaseLayer {
  static async addAddress(req: any) {
    var {
      phoneNumber,
      addressType,
      isDefault,
      addressLine1,
      addressLine2,
      zipCode,

      countryId,
      stateId,
      cityId,

      countryName,
      cityName,
      stateName,
    } = req.body.address;

    if (isDefault) {
      const data = await customerAddress.updateMany(
        {
          $and: [
            { customerId: req.currentUser.id },
            { isDefaultAddress: true },
          ],
        },
        { $set: { isDefaultAddress: false } }
      );
    } else {
      const data = await customerAddress.find({
        customerId: req.currentUser.id,
      });
      if (data.length == 0) {
        isDefault = true;
      }
    }

    if (countryName !== undefined && countryName !== null) {
      countryId = await this.checkAndAddCountry(countryName);
    }

    if (stateName !== undefined && stateName !== null) {
      stateId = await this.checkAndAddState(countryId, stateName);
    }

    if (cityName !== undefined && cityName !== null) {
      cityId = await this.checkAndAddCity(stateId, cityName);
    }

    await this.checkAllIdExistInDb(countryId, stateId, cityId);

    const data = customerAddress.build({
      customerId: req.currentUser.id,
      phoneNumber: phoneNumber,
      addressType: addressType,
      isDefaultAddress: isDefault,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      cityId: cityId,
      stateId: stateId,
      countryId: countryId,
      zipCode: zipCode,
    });
    await data.save();
    return data;
  }

  static async updateAddress(req: any, id: string) {
    var {
      phoneNumber,
      addressType,
      isDefault,
      addressLine1,
      addressLine2,
      zipCode,

      countryId,
      stateId,
      cityId,

      countryName,
      cityName,
      stateName,
    } = req.body.address;

    var isAddressExist = await customerAddress.findById(id);
    if (!isAddressExist) {
      throw new BadRequestError(`address does not exist for this id`);
    }

    if (isDefault) {
      const data = await customerAddress.updateMany(
        {
          $and: [
            { customerId: req.currentUser.id },
            { isDefaultAddress: true },
          ],
        },
        { $set: { isDefaultAddress: false } }
      );
    }

    try {
      if (countryName !== undefined && countryName !== null) {
        countryId = await this.checkAndAddCountry(countryName);
      }

      if (stateName !== undefined && stateName !== null) {
        stateId = await this.checkAndAddState(countryId, stateName);
      }

      if (cityName !== undefined && cityName !== null) {
        cityId = await this.checkAndAddCity(stateId, cityName);
      }

      await this.checkAllIdExistInDb(countryId, stateId, cityId);

      await customerAddress.findByIdAndUpdate(id, {
        phoneNumber: phoneNumber,
        addressType: addressType,
        isDefaultAddress: isDefault,
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        zipCode: zipCode,
        cityId: cityId,
        stateId: stateId,
        countryId: countryId,
      });

      var data = await customerAddress.findById(id);
      return data;
    } catch (err: any) {
      console.log(err.message);
      throw new BadRequestError(err.message);
    }
  }

  static async deleteAddress(id: string) {
    try {
      await customerAddress.findByIdAndDelete(id);
      return;
    } catch (err: any) {
      console.log(err.message);
      throw new BadRequestError(err.message);
    }
  }

  static async getCurrentUserAddress(req: any) {
    // const data = await customerAddress
    //   .find({ customerId: req.params.customerId })
    //   .populate({
    //     path: 'cityId',
    //     select: 'cityName',
    //     populate: {
    //       path: 'stateId',
    //       select: 'stateName',
    //       populate: {
    //         path: 'countryId',
    //         select: 'countryName',
    //       },
    //     },
    //   });

    const data = await customerAddress.aggregate([
      { $match: { customerId: req.params.customerId } },
      {
        $addFields: {
          cityObjId: { $toObjectId: '$cityId' },
        },
      },
      {
        $lookup: {
          from: 'cities',
          localField: 'cityObjId',
          foreignField: '_id',
          as: 'cityData',
          pipeline: [
            {
              $addFields: {
                stateObjId: { $toObjectId: '$stateId' },
              },
            },
            {
              $lookup: {
                from: 'states',
                localField: 'stateObjId',
                foreignField: '_id',
                as: 'stateData',
                pipeline: [
                  {
                    $addFields: { countryObjId: { $toObjectId: '$countryId' } },
                  },
                  {
                    $lookup: {
                      from: 'countries',
                      localField: 'countryObjId',
                      foreignField: '_id',
                      as: 'countryData',
                    },
                  },
                  {
                    $unwind: '$countryData',
                  },
                ],
              },
            },
            {
              $unwind: '$stateData',
            },
          ],
        },
      },
      {
        $unwind: '$cityData',
      },
      {
        $addFields: {
          cityName: '$cityData.cityName',
          stateName: '$cityData.stateData.stateName',
          countryName: '$cityData.stateData.countryData.countryName',
        },
      },
      { $unset: ['cityData', 'cityObjId'] },
    ]);
    return data;
  }

  static async findByIdAddressValidations(req: any) {
    //const data = await customerAddress.findById(req.params.id).populate({
    // path: 'cityId',
    // select: 'cityName',
    // populate: {
    //   path: 'stateId',
    //   populate: {
    //     path: 'countryId',
    //   },
    // },
    //});
    const data = await customerAddress.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $addFields: {
          cityObjId: { $toObjectId: '$cityId' },
        },
      },
      {
        $lookup: {
          from: 'cities',
          localField: 'cityObjId',
          foreignField: '_id',
          as: 'cityData',
          pipeline: [
            {
              $addFields: {
                stateObjId: { $toObjectId: '$stateId' },
              },
            },
            {
              $lookup: {
                from: 'states',
                localField: 'stateObjId',
                foreignField: '_id',
                as: 'stateData',
                pipeline: [
                  {
                    $addFields: {
                      countryObjId: { $toObjectId: '$countryId' },
                    },
                  },
                  {
                    $lookup: {
                      from: 'countries',
                      localField: 'countryObjId',
                      foreignField: '_id',
                      as: 'countryData',
                    },
                  },
                  {
                    $unwind: '$countryData',
                  },
                ],
              },
            },
            {
              $unwind: '$stateData',
            },
          ],
        },
      },
      {
        $unwind: '$cityData',
      },
      {
        $addFields: {
          cityName: '$cityData.cityName',
          stateName: '$cityData.stateData.stateName',
          countryName: '$cityData.stateData.countryData.countryName',
        },
      },
      { $unset: ['cityData', 'cityObjId'] },
    ]);
    return data != null ? data[0] : {};
  }

  static async checkAndAddCountry(countryName: string) {
    const checkDataExist = await Country.findOne({
      countryName: countryName,
    });
    if (!checkDataExist) {
      var data = Country.build({ countryName: countryName });
      await data.save();
      return data.id;
    } else {
      return checkDataExist.id;
    }
  }

  static async checkAndAddState(countryId: string, stateName: string) {
    const countryCheck = await Country.findOne({
      $and: [{ _id: countryId }, { isActive: true }],
    });

    if (countryCheck) {
      var isStateExist = await State.findOne({
        stateName: stateName,
      }).populate({ path: 'countryId' });

      if (!isStateExist) {
        var data = State.build({
          stateName: stateName,
          countryId: countryId,
        });
        await data.save();
        return data.id;
      } else if (isStateExist.countryId.id !== countryId) {
        console.log(
          `stateName country Id :: ${isStateExist.countryId.id} , ----> countryId :: ${countryId}`
        );
        //Insert new state if country is diff
        var data = State.build({
          stateName: stateName,
          countryId: countryId,
        });
        await data.save();
        return data.id;
      } else {
        return isStateExist.id;
      }
    }
  }

  static async checkAndAddCity(stateId: string, cityName: string) {
    const stateCheck = await State.findOne({
      $and: [{ _id: stateId }, { isActive: true }],
    });
    if (stateCheck) {
      var isCityExists = await City.findOne({
        cityName: cityName,
      }).populate({ path: 'stateId' });

      if (!isCityExists) {
        var data = City.build({
          cityName: cityName,
          stateId: stateId,
        });
        await data.save();
        return data.id;
      } else if (isCityExists.stateId.id !== stateId) {
        console.log(
          `cityName state Id :: ${isCityExists.stateId.id} , ----> stateId :: ${stateId}`
        );
        //Insert new state if country is diff
        var data = City.build({
          cityName: cityName,
          stateId: stateId,
        });
        await data.save();
        return data.id;
      } else {
        return isCityExists.id;
      }
    }
  }

  static async checkAllIdExistInDb(
    countryId: string,
    stateId: string,
    cityId: string
  ) {
    const isCountryExists = await Country.findById(countryId);
    const isStateExists = await State.findById(stateId);
    const isCityExists = await City.findById(cityId);

    if (!isCountryExists) {
      throw new BadRequestError(`invalid country id`);
    }

    if (!isStateExists) {
      throw new BadRequestError(`invalid state id`);
    }

    if (!isCityExists) {
      throw new BadRequestError(`invalid city id`);
    }
  }
}
