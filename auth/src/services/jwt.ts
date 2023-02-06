import jwt from 'jsonwebtoken';

export class JwtService {
  static accessToken = async (
    id: string,
    email: string,
    phoneNumber: string,
    countryCode: string,
    type: string
  ) => {
    console.log(
      `jwt :: id :: ${id} ,  emailId :: ${email}, phoneNo ::${countryCode} ${phoneNumber}  , type :: ${type}`
    );
    return jwt.sign(
      {
        id: id,
        email: email,
        phoneNumber: phoneNumber,
        countryCode: countryCode,
        type: type,
      },
      process.env.JWT_KEY!,
      { expiresIn: '1d' }
    );
  };

  static refreshToken = async (
    id: string,
    email: string,
    phoneNumber: string,
    countryCode: string,
    type: string
  ) => {
    console.log(
      `jwt refresh :: id :: ${id} ,  emailId :: ${email}, phoneNo :: ${countryCode} ${phoneNumber} , type :: ${type}`
    );
    return jwt.sign(
      {
        id: id,
        email: email,
        phoneNumber: phoneNumber,
        countryCode: countryCode,
        type: type,
      },
      process.env.JWT_KEY!,
      { expiresIn: '10d' }
    );
  };
}
