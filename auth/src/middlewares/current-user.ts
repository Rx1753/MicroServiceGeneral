import { BadRequestError } from '@rx-projects/common';
import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { Admin } from '../models/admin';
import { PayloadType } from '../services/string-values';

interface UserPayload {
  id: string;
  //email: string;
  //phoneNumber: string;
  type: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

//Middleware tokens

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
    const payload = jwt.verify(token, process.env.JWT_KEY!) as UserPayload;
    req.currentUser = payload;
    console.log('current user id', payload.id);
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      throw new BadRequestError(error.message);
    } else {
      throw new BadRequestError(error.message);
    }
  }
  next();
};

export const verifyAdminToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt && !req.headers['token']) {
    console.log('Token not provided');
    throw new BadRequestError('Token/Session not provided');
  }

  var token;
  if (req.session?.jwt) {
    token = req.session?.jwt;
  } else {
    token = req.headers['token'];
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_KEY!) as UserPayload;

    if (payload.type != PayloadType.AdminType) {
      throw new BadRequestError('Unauthorized Admin');
    }
    const data = await Admin.findOne({
      $and: [{ _id: payload.id }, { isActive: true }],
    });

    if (!data) {
      console.log('payload id', payload.id);
      throw new BadRequestError(
        'token/session you login is no more authorized'
      );
    }
    req.currentUser = payload;
    console.log('current user id', payload.id);
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      throw new BadRequestError(error.message);
    } else {
      throw new BadRequestError(error.message);
    }
  }
  next();
};

export const verifyCustomerToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt && !req.headers['token']) {
    console.log('token not wrote');
    throw new BadRequestError('Token/Session not provided');
  }

  var token;
  if (req.session?.jwt) {
    token = req.session?.jwt;
  } else {
    token = req.headers['token'];
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_KEY!) as UserPayload;
    if (payload.type != PayloadType.CustomerType) {
      throw new BadRequestError('Unauthorized User');
    }
    console.log(`payload :: ${payload.id}`)
    req.currentUser = payload;
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      throw new BadRequestError(error.message);
    } else {
      throw new BadRequestError(error.message);
    }
  }
  next();
};
