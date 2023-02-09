import { validateRequest } from '@rx-projects/common';
import express, { Request, Response, Router } from 'express';
import { CustomerAddressDomain } from '../domain/customer-address-domain';
import { verifyCustomerActiveToken } from '../middlewares/current-user';
import { CustomerAddressValidation } from '../validations/customer-address-validation';

const router = express.Router();
const baseUrl = `/api/users/customer/address`;

// add address
router.post(
  `${baseUrl}/create`,verifyCustomerActiveToken,CustomerAddressValidation.addAddressValidations,validateRequest,
  CustomerAddressDomain.addAddress
);

// update user address
router.put(
  `${baseUrl}/update/:id`,verifyCustomerActiveToken,CustomerAddressValidation.updateAddressValidations,validateRequest,
  CustomerAddressDomain.updateAddress
);

// delete user address
router.delete(
  `${baseUrl}/delete/:id`,verifyCustomerActiveToken,CustomerAddressValidation.deleteAddressValidations,validateRequest,
  CustomerAddressDomain.deleteAddress
);

router.get(
  `${baseUrl}/getaddress/single/:id`,verifyCustomerActiveToken,CustomerAddressValidation.findByIdAddressValidations,validateRequest,
  CustomerAddressDomain.findByIdAddressValidations
);

// get all address list
router.get(
  `${baseUrl}/getaddress/:customerId`,verifyCustomerActiveToken,CustomerAddressValidation.customerAddressValidations,validateRequest,
  CustomerAddressDomain.getCurrentUserAddress
);



export { router as customerAddressRouter };
