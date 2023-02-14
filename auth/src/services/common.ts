import mongoose from 'mongoose';
import { BadRequestError } from '@rx-projects/common';

export class Common {
  // To add seconds to the current time
  static addSecondsToDate(seconds: number) {
    const date = new Date();
    const updateDate = new Date();
    updateDate.setSeconds(updateDate.getSeconds() + seconds);

    console.log(`Send Otp Current date ---> ${date.toUTCString()}`);
    console.log(`Send Otp Expiry  date ---> ${updateDate.toUTCString()}`);
    return updateDate;
  }

  static addDaysToDate(days: number) {
    const date = new Date();
    const updateDate = new Date();
    updateDate.setDate(updateDate.getDate() + days);

    console.log(`Send Otp Current date :: ---> ${date.toUTCString()}`);
    console.log(`Send Otp Expiry  date :: ---> ${updateDate.toUTCString()}`);
    return updateDate;
  }

  static checkIsValidMongoId(id: any, msg?: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestError(msg ?? 'invalid param id');
    }
    return true;
  }
}
