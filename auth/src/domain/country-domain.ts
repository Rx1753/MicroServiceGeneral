import { Request, Response } from 'express';
import { CountryDatabaseLayer } from '../database-layer/country-data-layer';
import { ResponseModel } from '../services/response-model';

export class CountryDomain {

  static async createCountry(req: Request, res: Response) {
    const country = await CountryDatabaseLayer.createCountry(req);
    res.status(201).send(ResponseModel.success(country,'Country added successfully'));
  }

  static async updateCountry(req: Request, res: Response) {
    await CountryDatabaseLayer.updateCountry(req, req.params.id);
    res.status(200).send(ResponseModel.success({id: req.params.id},'Country updated successfully'));
  }

  static async deleteCountry(req: Request, res: Response) {
    await CountryDatabaseLayer.deleteCountry(req.params.id);
    res.status(200).send(ResponseModel.success({id: req.params.id},'Country deleted successfully'));
  }

  static async getCountryList(req: Request, res: Response) {
    const countries = await CountryDatabaseLayer.getCountryList(req);
    res.status(200).send(ResponseModel.success(countries));
  }
  static async getCountryByStatus(req: Request, res: Response) {
    const countries = await CountryDatabaseLayer.getCountryByStatus(req);
    res.status(200).send(ResponseModel.success(countries));
  }

  static async getCountryByName(req: Request, res: Response) {
    const countries = await CountryDatabaseLayer.getCountryByName(req);
    res.status(200).send(ResponseModel.success(countries));
  }
}
