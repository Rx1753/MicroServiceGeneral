import { BadRequestError } from '@rx-projects/common';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { CustomerAddressDatabaseLayer } from '../database-layer/customer-address-data-layer';
export class CustomerAddressDomain {
  static async addAddress(req: Request, res: Response) {
    const address = await CustomerAddressDatabaseLayer.addAddress(req);
    res.status(201).send(address);
  }

  static async updateAddress(req: Request, res: Response) {
    await CustomerAddressDatabaseLayer.updateAddress(req, req.params.id);
    res.status(201).send({ updated: true });
  }

  static async deleteAddress(req: Request, res: Response) {
    await CustomerAddressDatabaseLayer.deleteAddress(req.params.id);
    res.status(201).send({ deleted: true });
  }

  static async getCurrentUserAddress(req: Request, res: Response) {
    const address = await CustomerAddressDatabaseLayer.getCurrentUserAddress(
      req
    );
    res.status(201).send(address);
  }
}
