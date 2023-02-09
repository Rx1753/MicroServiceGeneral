import { validateRequest } from '@rx-projects/common';
import express, { Request, Response, Router } from 'express';
import { verifyAdminToken, verifyToken } from '../middlewares/current-user';
import { CountryValidation } from '../validations/country-validation';
import { CountryDomain } from '../domain/country-domain';

const router = express.Router();
const baseUrl = `/api/users/country`;

// Country create
router.post(
  `${baseUrl}/create`,verifyAdminToken,CountryValidation.countryCreateValidation,validateRequest,
  CountryDomain.createCountry
);

// Country update
router.put(
  `${baseUrl}/update/:id`,verifyAdminToken,CountryValidation.countryUpdateValidation,validateRequest,
  CountryDomain.updateCountry
);

// delete Country
router.delete(
  `${baseUrl}/delete/:id`,verifyAdminToken,CountryValidation.countryDeleteValidation,validateRequest,
  CountryDomain.deleteCountry
);

// get all Country
router.get(`${baseUrl}/getcountries`,verifyToken, CountryDomain.getCountryList);

router.get(
  `${baseUrl}/getlistbystatus`,verifyToken,CountryValidation.getListByStatusValidation,validateRequest,
  CountryDomain.getCountryByStatus
);

router.get(
  `${baseUrl}/getlistbyname`,verifyToken,CountryValidation.getCountryByNameValidation,validateRequest,
  CountryDomain.getCountryByName
);

export { router as countryRouter };
