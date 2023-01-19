import jwt from 'jsonwebtoken';

export class JwtService {
  static accessToken = async (payload: object) => {
    return jwt.sign(payload, process.env.JWT_KEY!, { expiresIn: '1d' });
  };

  static refreshToken = async (payload: object) => {
    return jwt.sign(payload, process.env.JWT_KEY!, { expiresIn: '10d' });
  };
}
