import { body, oneOf, query, param } from 'express-validator';
import { Common } from '../services/common';

export class CityValidation {
  static cityCreateValidation = [
    body('cityName').trim().notEmpty().withMessage('cityName is required.'),
    body('stateId').trim().notEmpty().withMessage('stateId is required.'),
  ];

  static cityUpdateValidation = [
    param('id').custom((value, { req }) => {
      return Common.checkIsValidMongoId(req.params?.id);
    }),
    body('cityName').trim().notEmpty().withMessage('cityName is required.'),
    body('stateId').trim().notEmpty().withMessage('stateId is required.'),
    body('isActive').isBoolean().withMessage('please provide status'),
  ];
  static cityDeleteValidation = [
    param('id').custom((value, { req }) => {
      return Common.checkIsValidMongoId(req.params?.id);
    }),
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
