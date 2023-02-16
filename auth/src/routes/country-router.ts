import { validateRequest } from '@rx-projects/common';
import express, { Request, Response, Router } from 'express';
import { verifyAdminToken, verifyToken } from '../middlewares/current-user';
import { CountryValidation } from '../validations/country-validation';
import { CountryDomain } from '../domain/country-domain';
import { SwaggerTags } from '../services/set-swagger-tags';

const router = express.Router();

// Country create
router.post(
  `/create`,verifyAdminToken,CountryValidation.countryCreateValidation,validateRequest,
  SwaggerTags.countryTag,
  CountryDomain.createCountry
);

// Country update
router.put(
  `/update/:id`,verifyAdminToken,CountryValidation.countryUpdateValidation,validateRequest,
  SwaggerTags.countryTag,
  CountryDomain.updateCountry
);

// delete Country
router.delete(
  `/delete/:id`,verifyAdminToken,CountryValidation.countryDeleteValidation,validateRequest,
  SwaggerTags.countryTag,
  CountryDomain.deleteCountry
);

// get all Country
router.get(`/getcountries`,verifyToken, SwaggerTags.countryTag,CountryDomain.getCountryList);

router.get(
  `/getlistbystatus`,verifyToken,CountryValidation.getListByStatusValidation,validateRequest,
  SwaggerTags.countryTag,
  CountryDomain.getCountryByStatus
);

router.get(
  `/getlistbyname`,verifyToken,CountryValidation.getCountryByNameValidation,validateRequest,
  SwaggerTags.countryTag,
  CountryDomain.getCountryByName
);

export { router as countryRouter };
