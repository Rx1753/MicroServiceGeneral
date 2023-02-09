import { Request, Response } from 'express';
import { CityDatabaseLayer } from '../database-layer/city-data-layer';
import { ResponseModel } from '../services/response-model';

export class CityDomain {

  static async createCity(req: Request, res: Response) {
    const data = await CityDatabaseLayer.createCity(req);
    res.status(201).send(ResponseModel.success(data, `City added`));
  }

  static async updateCity(req: Request, res: Response) {
    await CityDatabaseLayer.updateCity(req, req.params.id);
    res
      .status(200)
      .send(ResponseModel.success({id: req.params.id}, `City updated successfully`));
  }

  static async deleteCity(req: Request, res: Response) {
    await CityDatabaseLayer.deleteCity(req.params.id);
    res.status(200).send(ResponseModel.success({deleted: true}, `City deleted`));
  }

  static async getCityList(req: Request, res: Response) {
    const list = await CityDatabaseLayer.getCityList(req);
    res.status(200).send(ResponseModel.success(list));
  }

  static async getListBystatus(req: Request, res: Response) {
    const list = await CityDatabaseLayer.getListBystatus(req);
    res.status(200).send(ResponseModel.success(list));
  }
  
  static async getCityByName(req: Request, res: Response) {
    const list = await CityDatabaseLayer.getCityByName(req);
    res.status(200).send(ResponseModel.success(list));
  }
}
