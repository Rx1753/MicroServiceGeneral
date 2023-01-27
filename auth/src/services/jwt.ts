import jwt from 'jsonwebtoken';

export class JwtService {
  //email,id,type

  static accessToken = async (id: string, email: string, type: string) => {
    return jwt.sign(
      {
        id: id,
        email: email,
        type: type,
      },
      process.env.JWT_KEY!,
      { expiresIn: '1d' }
    );
  };

  static refreshToken = async (id: string, email: string, type: string) => {
    return jwt.sign(
      {
        id: id,
        email: email,
        type: type,
      },
      process.env.JWT_KEY!,
      { expiresIn: '10d' }
    );
  };
}
