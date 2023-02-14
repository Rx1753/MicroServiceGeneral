import { body, oneOf, query, param } from 'express-validator';
import { Common } from '../services/common';

export class CountryValidation {
  static countryCreateValidation = [
    body('countryName')
      .trim()
      .notEmpty()
      .withMessage('countryName is required'),
  ];
  static countryUpdateValidation = [
    param('id').custom((value, { req }) => {
      return Common.checkIsValidMongoId(req.params?.id);
    }),
    body('countryName')
      .trim()
      .notEmpty()
      .withMessage('countryName is required'),
    body('isActive').isBoolean().withMessage('isActive is required'),
  ];

  static countryDeleteValidation = [
    param('id').custom((value, { req }) => {
      return Common.checkIsValidMongoId(req.params?.id);
    }),
  ];

  static getListByStatusValidation = [
    query('isActive')
      .isBoolean()
      .withMessage('isActive is required in query params'),
  ];

  static getCountryByNameValidation = [
    query('countryName')
      .trim()
      .notEmpty()
      .withMessage('countryName is required in query params'),
  ];
}
