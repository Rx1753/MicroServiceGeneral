import { validateRequest } from '@rx-projects/common';
import express, { Request, Response, Router } from 'express';
import { CustomerAddressDomain } from '../domain/customer-address-domain';
import { verifyCustomerToken } from '../middlewares/current-user';
import { CustomerAddressValidation } from '../validations/customer-address-validation';

const router = express.Router();

// add address
router.post(
  '/api/users/customer/address/create',
  verifyCustomerToken,
  CustomerAddressValidation.addAddressValidations,
  validateRequest,
  CustomerAddressDomain.addAddress
);

// update user address
router.put(
  '/api/users/customer/address/update/:id',
  verifyCustomerToken,
  CustomerAddressValidation.updateAddressValidations,
  validateRequest,
  CustomerAddressDomain.updateAddress
);

// delete user address
router.delete(
  '/api/users/customer/address/delete/:id',
  verifyCustomerToken,
  CustomerAddressValidation.deleteAddressValidations,
  validateRequest,
  CustomerAddressDomain.deleteAddress
);

// get all address list
router.get(
  '/api/users/customer/address/getaddress/:id',
  verifyCustomerToken,
  CustomerAddressValidation.customerAddressValidations,
  validateRequest,
  CustomerAddressDomain.getCurrentUserAddress
);

export { router as customerAddressRouter };
