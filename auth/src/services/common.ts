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
}