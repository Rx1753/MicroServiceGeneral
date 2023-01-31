import { BadRequestError } from '@rx-projects/common';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { CountryDatabaseLayer } from '../database-layer/country-data-layer';

export class CountryDomain {
  static async createCountry(req: Request, res: Response) {
    const address = await CountryDatabaseLayer.createCountry(req);
    res.status(201).send({ msg: 'Country added successfully', data: address });
  }

  static async updateCountry(req: Request, res: Response) {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new BadRequestError('Requested id is not id type');
    }
    await CountryDatabaseLayer.updateCountry(req, req.params.id);
    res
      .status(201)
      .send({ id: req.params.id, msg: 'Country updated successfully' });
  }

  static async deleteCountry(req: Request, res: Response) {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new BadRequestError('Requested id is not id type');
    }
    await CountryDatabaseLayer.deleteCountry(req.params.id);
    res
      .status(201)
      .send({ id: req.params.id, msg: 'Country deleted successfully' });
  }

  static async getCountryList(req: Request, res: Response) {
    const address = await CountryDatabaseLayer.getCountryList(req);
    res.status(201).send(address);
  }
  static async getCountryByStatus(req: Request, res: Response) {
    const address = await CountryDatabaseLayer.getCountryByStatus(req);
    res.status(201).send(address);
  }

  static async getCountryByName(req: Request, res: Response) {
    const address = await CountryDatabaseLayer.getCountryByName(req);
    res.status(201).send(address);
  }
}
