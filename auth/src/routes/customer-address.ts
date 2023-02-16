import { validateRequest } from '@rx-projects/common';
import express, { Request, Response, Router } from 'express';
import { CustomerAddressDomain } from '../domain/customer-address-domain';
import { verifyCustomerActiveToken } from '../middlewares/current-user';
import { SwaggerTags } from '../services/set-swagger-tags';
import { CustomerAddressValidation } from '../validations/customer-address-validation';

const router = express.Router();

// add address
router.post(
  `/create`,verifyCustomerActiveToken,CustomerAddressValidation.addAddressValidations,validateRequest,
  SwaggerTags.customerAddressTag,
  CustomerAddressDomain.addAddress
);

// update user address
router.put(
  `/update/:id`,verifyCustomerActiveToken,CustomerAddressValidation.updateAddressValidations,validateRequest,
  SwaggerTags.customerAddressTag,
  CustomerAddressDomain.updateAddress
);

// delete user address
router.delete(
  `/delete/:id`,verifyCustomerActiveToken,CustomerAddressValidation.deleteAddressValidations,validateRequest,
  SwaggerTags.customerAddressTag,
  CustomerAddressDomain.deleteAddress
);

router.get(
  `/getaddress/single/:id`,verifyCustomerActiveToken,CustomerAddressValidation.findByIdAddressValidations,validateRequest,
  SwaggerTags.customerAddressTag,
  CustomerAddressDomain.findByIdAddressValidations
);

// get all address list
router.get(
  `/getaddress/:customerId`,verifyCustomerActiveToken,CustomerAddressValidation.customerAddressValidations,validateRequest,
  SwaggerTags.customerAddressTag,
  CustomerAddressDomain.getCurrentUserAddress
);



export { router as customerAddressRouter };
