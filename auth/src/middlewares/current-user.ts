import { BadRequestError } from '@rx-projects/common';
import { Request, Response, NextFunction } from 'express';

interface UserPayload {
  id: string;
  email: string;
  type: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

//Middlerware tokens

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt && !req.headers['token']) {
    console.log('token is empty');
    throw new BadRequestError('Token/Session not provided');
  }

  var token;
  if (req.session?.jwt) {
    token = req.session?.jwt;
  } else {
    token = req.headers['token'];
  }

  try {
  } catch (error) {}
};
