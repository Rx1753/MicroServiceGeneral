import { validateRequest } from '@rx-projects/common';
import express, { Request, Response, Router } from 'express';
import { CityDomain } from '../domain/city-domain';
import { verifyAdminToken, verifyToken } from '../middlewares/current-user';
import { SwaggerTags } from '../services/set-swagger-tags';
import { CityValidation } from '../validations/city-validation';

const router = express.Router();
//add city
router.post(
  `/create`,verifyAdminToken,CityValidation.cityCreateValidation,validateRequest,
  SwaggerTags.cityTag,CityDomain.createCity
);

//update city
router.put(
  `/update/:id`,verifyAdminToken,CityValidation.cityUpdateValidation,validateRequest,
  SwaggerTags.cityTag,CityDomain.updateCity
);

//delete city
router.delete(
  `/delete/:id`,verifyAdminToken,CityValidation.cityDeleteValidation,validateRequest,
  SwaggerTags.cityTag,CityDomain.deleteCity
);

// // get all city
router.get(
  `/getcities`,verifyToken,
  SwaggerTags.cityTag,CityDomain.getCityList
);

router.get(
  `/getlistbystatus`,
  verifyToken,CityValidation.getListByStatusValidation,validateRequest,
  SwaggerTags.cityTag,CityDomain.getListBystatus
);

router.get(
  `/getlistbyname`,verifyToken,CityValidation.getCityByNameValidation,validateRequest,
  SwaggerTags.cityTag,CityDomain.getCityByName
);

export { router as cityRouter };
