import { BadRequestError } from '@rx-projects/common';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { CityDatabaseLayer } from '../database-layer/city-data-layer';

export class CityDomain {
  static async createCity(req: Request, res: Response) {
    const data = await CityDatabaseLayer.createCity(req);
    res.status(201).send({ msg: 'City added successfully', data: data });
  }
  static async updateCity(req: Request, res: Response) {
    await CityDatabaseLayer.updateCity(req, req.params.id);
    res
      .status(201)
      .send({ msg: 'City updated successfully', id: req.params.id });
  }

  static async deleteCity(req: Request, res: Response) {
    await CityDatabaseLayer.deleteCity(req.params.id);
    res.status(201).send({ deleted: true });
  }

  static async getCityList(req: Request, res: Response) {
    const State = await CityDatabaseLayer.getCityList(req);
    res.status(201).send(State);
  }

  static async getListBystatus(req: Request, res: Response) {
    const State = await CityDatabaseLayer.getListBystatus(req);
    res.status(201).send(State);
  }
  static async getCityByName(req: Request, res: Response) {
    const State = await CityDatabaseLayer.getCityByName(req);
    res.status(201).send(State);
  }
}
