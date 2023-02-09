import { validateRequest } from '@rx-projects/common';
import express, { Request, Response, Router } from 'express';
import { CityDomain } from '../domain/city-domain';
import { verifyAdminToken } from '../middlewares/current-user';
import { CityValidation } from '../validations/city-validation';

const router = express.Router();
var baseUrl = `/api/users/city`;

//add city
router.post(
  `${baseUrl}/create`,verifyAdminToken,CityValidation.cityCreateValidation,validateRequest,
  CityDomain.createCity
);

//update city
router.put(
  `${baseUrl}/update/:id`,verifyAdminToken,CityValidation.cityUpdateValidation,validateRequest,
  CityDomain.updateCity
);

//delete city
router.delete(
  `${baseUrl}/delete/:id`,verifyAdminToken,CityValidation.cityDeleteValidation,validateRequest,
  CityDomain.deleteCity
);

// // get all city
router.get(`${baseUrl}/getcities`, CityDomain.getCityList);

router.get(
  `${baseUrl}/getlistbystatus`,CityValidation.getListByStatusValidation,validateRequest,
  CityDomain.getListBystatus
);

router.get(
  `${baseUrl}/getlistbyname`,CityValidation.getCityByNameValidation,validateRequest,
  CityDomain.getCityByName
);

export { router as cityRouter };
