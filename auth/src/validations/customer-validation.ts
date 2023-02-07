import { body, oneOf, check, query, param } from 'express-validator';
import { BadRequestError } from '@rx-projects/common';
import { Common } from '../services/common';

export class CustomerAuthValidation {
  static signupValidation = [
    body('userName')
      .trim()
      .notEmpty()
      .withMessage('Please provide a userName.')
      .optional(),
    body('firstName')
      .trim()
      .notEmpty()
      .withMessage('Please provide a firstName.'),
    body('lastName')
      .trim()
      .notEmpty()
      .withMessage('Please provide a lastName.'),
    body('password')
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage('password must be between 4 and 20 characters'),
    body('email').isEmail().withMessage('email must be valid').optional(),
    body('phoneNumber')
      .trim()
      .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
      .withMessage('phone number must be valid')
      .optional(),
    body('gender').trim().notEmpty().withMessage('Please provide a gender.'),
    check('dob').trim().isDate().withMessage('Must be a valid dob date'),
    oneOf(
      [body('email').notEmpty(), body('phoneNumber').notEmpty()],
      'email/phoneNumber is required to register'
    ),
    body('countryCode').custom((value, { req }) => {
      if (req.body.phoneNumber !== null && req.body.phoneNumber !== undefined) {
        if (
          req.body.countryCode === null ||
          req.body.countryCode == undefined ||
          req.body.countryCode.trim() === ''
        ) {
          throw new BadRequestError(
            `country code is required for sign up with phoneNumber`
          );
        }
      }
      return true;
    }),
    // body('referralCode')
    //   .trim()
    //   .notEmpty()
    //   .withMessage('Please provide a referralCode.')
    //   .optional(),
  ];
  static signInValidation = [
    body('email').isEmail().withMessage('email must be valid').optional(),
    body('phoneNumber')
      .trim()
      .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
      .withMessage('phone number must be valid')
      .optional(),
    body('password')
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage('password must be between 4 and 20 characters'),
    oneOf(
      [body('email').notEmpty(), body('phoneNumber').notEmpty()],
      'email/phoneNumber is required to signin'
    ),
    body('countryCode').custom((value, { req }) => {
      if (req.body.phoneNumber !== null && req.body.phoneNumber !== undefined) {
        if (
          req.body.countryCode === null ||
          req.body.countryCode == undefined ||
          req.body.countryCode.trim() === ''
        ) {
          throw new BadRequestError(
            `country code is required for sign in with phoneNumber`
          );
        }
      }
      return true;
    }),
  ];

  static updateProfileValidation = [
    param('id').custom((value, { req }) => {
      return Common.checkIsValidMongoId(req.params?.id);
    }),
    body('firstName').notEmpty().withMessage('firstName must be valid'),
    body('lastName').notEmpty().withMessage('lastName must be valid'),
    body('gender').notEmpty().withMessage('gender must be valid').optional(),
    body('email').isEmail().withMessage('email must be valid').optional(),
    body('phoneNumber')
      .notEmpty()
      .withMessage('phoneNumber must be valid')
      .optional(),
    check('dob')
      .trim()
      .isDate()
      .withMessage('Must be a valid dob date')
      .optional(),
    body('countryCode').custom((value, { req }) => {
      if (req.body.phoneNumber !== null && req.body.phoneNumber !== undefined) {
        if (
          req.body.countryCode === null ||
          req.body.countryCode == undefined ||
          req.body.countryCode.trim() === ''
        ) {
          throw new BadRequestError(
            `country code is required for updating profile`
          );
        }
      }
      return true;
    }),
  ];

  static changePasswordValidation = [
    body('oldPassword')
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage('password must be between 4 to 20 characters'),
    body('newPassword')
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage('changedPassword must be between 4 to 20 characters')
      .custom((value, { req }) => value !== req.body.oldPassword)
      .withMessage('oldPassword & newPassword should not match'),
  ];

  static forgotPasswordValidation = [
    body('email').isEmail().withMessage('email must be valid').optional(),
    body('phoneNumber')
      .trim()
      .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
      .withMessage('phone number must be valid')
      .optional(),
    oneOf(
      [body('email').notEmpty(), body('phoneNumber').notEmpty()],
      'email/phoneNumber is required to send otp'
    ),
    body('countryCode').custom((value, { req }) => {
      if (req.body.phoneNumber !== null && req.body.phoneNumber !== undefined) {
        if (
          req.body.countryCode === null ||
          req.body.countryCode == undefined ||
          req.body.countryCode.trim() === ''
        ) {
          throw new BadRequestError(
            `country code is required for sign in with phoneNumber`
          );
        }
      }
      return true;
    }),
  ];

  static forgotPasswordVerificationValidation = [
    body('code').notEmpty().withMessage('code is required'),
    body('password')
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage('password must be between 4 and 20 characters'),

    body('email').isEmail().withMessage('email must be valid').optional(),
    body('phoneNumber')
      .trim()
      .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
      .withMessage('phone number must be valid')
      .optional(),
    oneOf(
      [body('email').notEmpty(), body('phoneNumber').notEmpty()],
      'email/phoneNumber is required to send otp'
    ),
    body('countryCode').custom((value, { req }) => {
      if (req.body.phoneNumber !== null && req.body.phoneNumber !== undefined) {
        if (
          req.body.countryCode === null ||
          req.body.countryCode == undefined ||
          req.body.countryCode.trim() === ''
        ) {
          throw new BadRequestError(
            `country code is required for sign in with phoneNumber`
          );
        }
      }
      return true;
    }),
  ];

  static deleteCustomer = [
    param('id').custom((value, { req }) => {
      return Common.checkIsValidMongoId(req.params?.id);
    }),
  ];

  static checkMFA = [
    body('isMFA')
      .isBoolean()
      .withMessage('isMfa value is required which is bool'),
    body('email').isEmail().withMessage('email must be valid').optional(),
    body('phoneNumber')
      .notEmpty()
      .withMessage('phoneNumber must be valid')
      .optional(),
    body('countryCode').custom((value, { req }) => {
      if (req.body.phoneNumber !== null && req.body.phoneNumber !== undefined) {
        if (
          req.body.countryCode === null ||
          req.body.countryCode == undefined ||
          req.body.countryCode.trim() === ''
        ) {
          throw new BadRequestError(
            `country code is required for phone verification`
          );
        }
      }
      return true;
    }),
  ];

  static verifyEmailValidation = [
    body('code').notEmpty().withMessage('verification code is required'),
  ];
  static verifyPhoneNumberValidation = [
    body('code').notEmpty().withMessage('verification code is required'),
  ];

  static getListByStatusValidation = [
    query('isActive')
      .isBoolean()
      .withMessage('isActive value is required which is bool'),
  ];

  static getListByNameValidation = [
    query('searchName').notEmpty().withMessage('searchName value is required'),
  ];
}
