import { body, oneOf, query } from 'express-validator';

export class CountryValidation {
  static countryCreateValidation = [
    body('countryName')
      .trim()
      .notEmpty()
      .withMessage('countryName is required'),
  ];
  static countryUpdateValidation = [
    body('countryName')
      .trim()
      .notEmpty()
      .withMessage('countryName is required'),
    body('isActive').isBoolean().withMessage('isActive is required'),
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
