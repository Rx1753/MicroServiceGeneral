import { body, oneOf, query } from 'express-validator';

export class StateValidation {
  static stateCreateValidation = [
    body('stateName').trim().notEmpty().withMessage('stateName is required.'),
    body('countryId').trim().notEmpty().withMessage('countryId is required.'),
  ];
  static stateUpdateValidation = [
    body('stateName').trim().notEmpty().withMessage('stateName is required.'),
    body('countryId').trim().notEmpty().withMessage('countryId is required.'),
    body('isActive').isBoolean().withMessage('please provide status'),
  ];

  static getListByStatusValidation = [
    query('isActive')
      .isBoolean()
      .withMessage('isActive is required in query params'),
  ];
  static getStateByNameValidation = [
    query('stateName')
      .trim()
      .notEmpty()
      .withMessage('stateName is required in query params'),
  ];
}
