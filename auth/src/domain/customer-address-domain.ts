import { Request, Response } from 'express';
import { CustomerAddressDatabaseLayer } from '../database-layer/customer-address-data-layer';
import { ResponseModel } from '../services/response-model';

export class CustomerAddressDomain {
  static async addAddress(req: Request, res: Response) {
    const address = await CustomerAddressDatabaseLayer.addAddress(req);
    res.status(201).send(ResponseModel.success(address, `Address added`));
  }

  static async updateAddress(req: Request, res: Response) {
    var resData = await CustomerAddressDatabaseLayer.updateAddress(req,req.params.id);
    res.status(200).send(ResponseModel.success(resData, `Address updated`));
  }

  static async deleteAddress(req: Request, res: Response) {
    await CustomerAddressDatabaseLayer.deleteAddress(req.params.id);
    res.status(200).send(ResponseModel.success({ deleted: true, id: req.params.id }, `Address deleted`));
  }

  static async getCurrentUserAddress(req: Request, res: Response) {
    const address = await CustomerAddressDatabaseLayer.getCurrentUserAddress(req);
    res.status(200).send(ResponseModel.success(address, `Fetched addresses for customer`));
  }

  static async findByIdAddressValidations(req: Request, res: Response) {
    const address =
      await CustomerAddressDatabaseLayer.findByIdAddressValidations(req);
    res.status(200).send(ResponseModel.success(address, `Single address fetched`));
  }
}
