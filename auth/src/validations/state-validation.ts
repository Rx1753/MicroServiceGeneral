import { body, oneOf, query, param } from 'express-validator';
import { Common } from '../services/common';

export class StateValidation {
  static stateCreateValidation = [
    body('stateName').trim().notEmpty().withMessage('stateName is required.'),
    body('countryId').trim().notEmpty().withMessage('countryId is required.'),
  ];
  static stateUpdateValidation = [
    param('id').custom((value, { req }) => {
      return Common.checkIsValidMongoId(req.params?.id);
    }),
    body('stateName').trim().notEmpty().withMessage('stateName is required.'),
    body('countryId').trim().notEmpty().withMessage('countryId is required.'),
    body('isActive').isBoolean().withMessage('please provide status'),
  ];

  static stateDeleteValidation = [
    param('id').custom((value, { req }) => {
      return Common.checkIsValidMongoId(req.params?.id);
    }),
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
