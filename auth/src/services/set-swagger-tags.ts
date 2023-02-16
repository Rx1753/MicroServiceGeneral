import { Request, Response, NextFunction } from 'express';

export class SwaggerTags {
  static async adminTag(req: any, res: any, next: NextFunction) {
    // #swagger.tags = ['admin']
    next();
  }

  static async customerTag(req: any, res: any, next: NextFunction) {
    // #swagger.tags = ['customers']
    next();
  }

  static async customerAddressTag(req: any, res: any, next: NextFunction) {
    // #swagger.tags = ['customer address']
    next();
  }

  static async countryTag(req: any, res: any, next: NextFunction) {
    // #swagger.tags = ['country']
    next();
  }

  static async stateTag(req: any, res: any, next: NextFunction) {
    // #swagger.tags = ['state']
    next();
  }

  static async cityTag(req: any, res: any, next: NextFunction) {
    // #swagger.tags = ['city']
    next();
  }
}
