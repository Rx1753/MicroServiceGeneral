import { BadRequestError } from '@rx-projects/common';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { StateDatabaseLayer } from '../database-layer/state-data-layer';

export class StateDomain {
  static async createState(req: Request, res: Response) {
    const data = await StateDatabaseLayer.createState(req);
    res.status(201).send({ msg: 'State added successfully', data: data });
  }

  static async updateState(req: Request, res: Response) {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new BadRequestError('Invalid param id');
    }
    await StateDatabaseLayer.updateState(req, req.params.id);
    res
      .status(201)
      .send({ msg: 'State updated successfully', id: req.params.id });
  }

  static async deleteState(req: Request, res: Response) {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new BadRequestError('Invalid param id');
    }
    await StateDatabaseLayer.deleteState(req.params.id);
    res.status(201).send({ deleted: true });
  }

  static async getStateList(req: Request, res: Response) {
    const State = await StateDatabaseLayer.getStateList(req);
    res.status(201).send(State);
  }

  static async getListBystatus(req: Request, res: Response) {
    const State = await StateDatabaseLayer.getListBystatus(req);
    res.status(201).send(State);
  }
  static async getStateByName(req: Request, res: Response) {
    const State = await StateDatabaseLayer.getStateByName(req);
    res.status(201).send(State);
  }
}
