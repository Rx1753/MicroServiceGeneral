import { body, oneOf, query } from 'express-validator';

export class CityValidation {

  static cityCreateValidation = [
    body('cityName').trim().notEmpty().withMessage('cityName is required.'),
    body('stateId').trim().notEmpty().withMessage('stateId is required.'),
  ];

  static cityUpdateValidation = [
    body('cityName').trim().notEmpty().withMessage('cityName is required.'),
    body('stateId').trim().notEmpty().withMessage('stateId is required.'),
    body('isActive').isBoolean().withMessage('please provide status'),
  ];

  static getListByStatusValidation = [
    query('isActive')
      .isBoolean()
      .withMessage('isActive is required in query params'),
  ];
  static getCityByNameValidation = [
    query('cityName')
      .trim()
      .notEmpty()
      .withMessage('cityName is required in query params'),
  ];
}
