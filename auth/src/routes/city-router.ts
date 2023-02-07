import { validateRequest } from '@rx-projects/common';
import express, { Request, Response, Router } from 'express';
import { CityDomain } from '../domain/city-domain';
import { verifyAdminToken } from '../middlewares/current-user';
import { CityValidation } from '../validations/city-validation';

const router = express.Router();

//add city
router.post(
  '/api/users/city/create',
  verifyAdminToken,
  CityValidation.cityCreateValidation,
  validateRequest,
  CityDomain.createCity
);

//update city
router.put(
  '/api/users/city/update/:id',
  verifyAdminToken,
  CityValidation.cityUpdateValidation,
  validateRequest,
  CityDomain.updateCity
);

//delete city
router.delete(
  '/api/users/city/delete/:id',
  verifyAdminToken,
  CityValidation.cityDeleteValidation,
  validateRequest,
  CityDomain.deleteCity
);

// // get all city
router.get('/api/users/city/getcities', CityDomain.getCityList);
router.get(
  '/api/users/city/getlistbystatus',
  CityValidation.getListByStatusValidation,
  validateRequest,
  CityDomain.getListBystatus
);

router.get(
  '/api/users/city/getlistbyname',
  CityValidation.getCityByNameValidation,
  validateRequest,
  CityDomain.getCityByName
);

export { router as cityRouter };
