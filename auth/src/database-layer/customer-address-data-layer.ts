import { BadRequestError } from '@rx-projects/common';
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

    console.log(`req.body.address :: ${JSON.stringify(addressLine1)}`);

    if (isDefault) {
      const data = await customerAddress.findOneAndUpdate(
        {
          $and: [
            { customerId: req.currentUser.id },
            { isDefalultAddress: true },
          ],
        },
        { $set: { isDefalultAddress: false } }
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

    if (isDefault) {
      const data = await customerAddress.findOne({
        $and: [{ customerId: req.currentUser.id }, { isDefalultAddress: true }],
      });
      await customerAddress.findByIdAndUpdate(data?._id, {
        isDefaultAddress: false,
      });
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
        isDefalultAddress: isDefault,
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        zipCode: zipCode,
        cityId: cityId,
        stateId: stateId,
        countryId: countryId,
      });

      return;
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
    const data = await customerAddress
      .find({ customerId: req.currentUser.id })
      .populate({
        path: 'cityId',
        populate: {
          path: 'stateId',
          populate: {
            path: 'countryId',
          },
        },
      });
    return data;
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
      });

      if (!isStateExist) {
        var data = State.build({
          stateName: stateName,
          countryId: countryCheck._id,
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
      });

      if (!isCityExists) {
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
