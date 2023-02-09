import { Request, Response } from 'express';
import { StateDatabaseLayer } from '../database-layer/state-data-layer';
import { ResponseModel } from '../services/response-model';

export class StateDomain {
  
  static async createState(req: Request, res: Response) {
    const data = await StateDatabaseLayer.createState(req);
    res.status(201).send(ResponseModel.success(data, `State added`));
  }

  static async updateState(req: Request, res: Response) {
    await StateDatabaseLayer.updateState(req, req.params.id);
    res.status(200).send(ResponseModel.success({id: req.params.id}, `State updated`));
  }

  static async deleteState(req: Request, res: Response) {
    await StateDatabaseLayer.deleteState(req.params.id);
    res.status(200).send(ResponseModel.success({deleted:true,id: req.params.id}, `State deleted`));
  }

  static async getStateList(req: Request, res: Response) {
    const states = await StateDatabaseLayer.getStateList(req);
    res.status(200).send(ResponseModel.success(states));
  }

  static async getListBystatus(req: Request, res: Response) {
    const states = await StateDatabaseLayer.getListBystatus(req);
    res.status(200).send(ResponseModel.success(states));
  }
  static async getStateByName(req: Request, res: Response) {
    const states = await StateDatabaseLayer.getStateByName(req);
    res.status(200).send(ResponseModel.success(states));
  }
}
