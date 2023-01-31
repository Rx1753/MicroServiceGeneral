import { validateRequest } from '@rx-projects/common';
import express, { Request, Response, Router } from 'express';
import { verifyAdminToken } from '../middlewares/current-user';
import { CountryValidation } from '../validations/country-validation';
import { CountryDomain } from '../domain/country-domain';

const router = express.Router();

//ADMIN Middleware check

// Country create
router.post(
  '/api/users/country/create',
  verifyAdminToken,
  CountryValidation.countryCreateValidation,
  validateRequest,
  CountryDomain.createCountry
);

// Country update
router.put(
  '/api/users/country/update/:id',
  verifyAdminToken,
  CountryValidation.countryUpdateValidation,
  validateRequest,
  CountryDomain.updateCountry
);

// delete Country
router.delete(
  '/api/users/country/delete/:id',
  verifyAdminToken,
  CountryDomain.deleteCountry
);

// get all Country
router.get('/api/users/country/getList', CountryDomain.getCountryList);
router.get(
  '/api/users/country/getListBystatus',
  CountryValidation.getListByStatusValidation,
  validateRequest,
  CountryDomain.getCountryByStatus
);

router.get(
  '/api/users/country/getCountryByName',
  CountryValidation.getCountryByNameValidation,
  validateRequest,
  CountryDomain.getCountryByName
);

export { router as countryRouter };
