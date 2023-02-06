import express, { Request, Response, Router } from 'express';
import { CustomerAddressDomain } from '../domain/customer-address-domain';
import { verifyCustomerToken } from '../middlewares/current-user';

const router = express.Router();

// add address
router.post(
  '/api/users/customer/address/create',
  verifyCustomerToken,
  CustomerAddressDomain.createAddress
);

// update user address
router.put(
  '/api/users/customer/address/update/:id',
  verifyCustomerToken,
  CustomerAddressDomain.updateAddress
);

// delete user address
router.delete(
  '/api/users/customer/address/delete/:id',
  verifyCustomerToken,
  CustomerAddressDomain.deleteAddress
);

// get all address list
router.get(
  '/api/users/customer/address/getaddress',
  verifyCustomerToken,
  CustomerAddressDomain.getCurrentUserAddress
);

export { router as customerAddressRouter };
