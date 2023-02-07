import { body, oneOf, check, query, param } from 'express-validator';
import { Common } from '../services/common';

export class CustomerAddressValidation {
  static addAddressValidations = [
    body('address.phoneNumber')
      .trim()
      .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
      .withMessage('phone number must be valid')
      .optional(),
    body('address.addressType')
      .trim()
      .notEmpty()
      .withMessage('Please provide a addressType.'),
    body('address.isDefault').isBoolean().withMessage('isDefault is required'),
    body('address.addressLine1')
      .trim()
      .notEmpty()
      .withMessage('Please provide a addressLine1.'),
    body('address.addressLine2')
      .trim()
      .notEmpty()
      .withMessage('Please provide a addressLine2.'),
    body('address.zipCode')
      .trim()
      .notEmpty()
      .withMessage('Please provide a zipCode.'),

    body('address.countryId')
      .trim()
      .notEmpty()
      .withMessage('Please provide a countryId.')
      .optional(),
    body('address.stateId')
      .trim()
      .notEmpty()
      .withMessage('Please provide a stateId.')
      .optional(),
    body('address.cityId')
      .trim()
      .notEmpty()
      .withMessage('Please provide a cityId.')
      .optional(),

    body('address.countryName')
      .trim()
      .notEmpty()
      .withMessage('Please provide a countryName.')
      .optional(),
    body('address.stateName')
      .trim()
      .notEmpty()
      .withMessage('Please provide a stateName.')
      .optional(),
    body('address.cityName')
      .trim()
      .notEmpty()
      .withMessage('Please provide a cityName.')
      .optional(),
    oneOf(
      [
        body('address.countryId').notEmpty(),
        body('address.countryName').notEmpty(),
      ],
      'countryId/countryName is required'
    ),
    oneOf(
      [
        body('address.stateId').notEmpty(),
        body('address.stateName').notEmpty(),
      ],
      'stateId/stateName is required'
    ),
    oneOf(
      [body('address.cityId').notEmpty(), body('address.cityName').notEmpty()],
      'cityId/cityName is required'
    ),
  ];

  static updateAddressValidations = [
    param('id').custom((value, { req }) => {
      return Common.checkIsValidMongoId(req.params?.id);
    }),
    body('address.phoneNumber')
      .trim()
      .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
      .withMessage('phone number must be valid')
      .optional(),
    body('address.addressType')
      .trim()
      .notEmpty()
      .withMessage('Please provide a addressType.'),
    body('address.address.isDefault')
      .isBoolean()
      .withMessage('isDefault is required'),
    body('address.addressLine1')
      .trim()
      .notEmpty()
      .withMessage('Please provide a addressLine1.'),
    body('address.addressLine2')
      .trim()
      .notEmpty()
      .withMessage('Please provide a addressLine2.'),
    body('address.zipCode')
      .trim()
      .notEmpty()
      .withMessage('Please provide a zipCode.'),

    body('address.countryId')
      .trim()
      .notEmpty()
      .withMessage('Please provide a countryId.')
      .optional(),
    body('address.stateId')
      .trim()
      .notEmpty()
      .withMessage('Please provide a stateId.')
      .optional(),
    body('address.cityId')
      .trim()
      .notEmpty()
      .withMessage('Please provide a cityId.')
      .optional(),

    body('address.countryName')
      .trim()
      .notEmpty()
      .withMessage('Please provide a countryName.')
      .optional(),
    body('address.stateName')
      .trim()
      .notEmpty()
      .withMessage('Please provide a stateName.')
      .optional(),
    body('address.cityName')
      .trim()
      .notEmpty()
      .withMessage('Please provide a cityName.')
      .optional(),
    oneOf(
      [
        body('address.countryId').notEmpty(),
        body('address.countryName').notEmpty(),
      ],
      'countryId/countryName is required'
    ),
    oneOf(
      [
        body('address.stateId').notEmpty(),
        body('address.stateName').notEmpty(),
      ],
      'stateId/stateName is required'
    ),
    oneOf(
      [body('address.cityId').notEmpty(), body('address.cityName').notEmpty()],
      'cityId/cityName is required'
    ),
  ];

  static deleteAddressValidations = [
    param('id').custom((value, { req }) => {
      return Common.checkIsValidMongoId(req.params?.id);
    }),
  ];

  static customerAddressValidations = [
    param('id').custom((value, { req }) => {
      return Common.checkIsValidMongoId(req.params?.id);
    }),
  ];
}
