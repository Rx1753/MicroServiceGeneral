import { BadRequestError } from '@rx-projects/common';
import { body, check, oneOf, query, param } from 'express-validator';
import { PermissionNameEnum } from '../models/admin-permissions';
import { Common } from '../services/common';

export class Validation {
  static addAdminValidation = [
    body('userName').trim().notEmpty().withMessage('Please provide a name.'),
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
      'email/phoneNumber is required to sign up'
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
    body('roleId')
      .trim()
      .notEmpty()
      .withMessage('Please provide a roleId.')
      .custom((value, { req }) => {
        return Common.checkIsValidMongoId(
          req.body?.roleId,
          'invalid roleId type'
        );
      }),
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
      'email/phoneNumber is required to sign in'
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

  static addPermissionsValidation = [
    body('tableName')
      .notEmpty()
      .withMessage('Please provide tableName')
      .isIn([PermissionNameEnum[PermissionNameEnum.adminPanelPermissions]])
      .withMessage('Please provide valid name'),
    body('isRead').isBoolean().withMessage('isRead is required'),
    body('isUpdate').isBoolean().withMessage('isUpdate is required'),
    body('isDelete').isBoolean().withMessage('isDelete is required'),
    body('isCreate').isBoolean().withMessage('isCreate is required'),
  ];

  static createRoleValidation = [
    body('roleName').notEmpty().withMessage('Please provide tableName'),
    //body('permissionId').notEmpty().withMessage('permissionId is required'),
    body('permissionId')
      .isArray()
      .notEmpty()
      .withMessage('permissionId is required as an array')
      .custom(async (permissions) => {
        if (permissions !== undefined) {
          const isPermissionIdRepeatArr: string[] = [];
          await Promise.all(
            permissions.map(async (e: any) => {
              if (isPermissionIdRepeatArr.includes(e)) {
                throw new BadRequestError(`permissionId $${e} is repeated`);
              } else {
                isPermissionIdRepeatArr.push(e);
              }
            })
          );
          return true;
        } else {
          return false;
        }
      }),
  ];

  static updateRolePermissionValidation = [
    body('roleId').notEmpty().withMessage('Please provide roleId'),
    //body('permissionId').notEmpty().withMessage('permissionId is required'),
    body('permissionId')
      .isArray()
      .notEmpty()
      .withMessage('permissionId is required as an array')
      .custom(async (permissions) => {
        if (permissions !== undefined) {
          const isPermissionIdRepeatArr: string[] = [];
          await Promise.all(
            permissions.map(async (e: any) => {
              if (isPermissionIdRepeatArr.includes(e)) {
                throw new BadRequestError(`permissionId $${e} is repeated`);
              } else {
                isPermissionIdRepeatArr.push(e);
              }
            })
          );
          return true;
        } else {
          return false;
        }
      }),
  ];

  static updateAdminRoleValidation = [
    body('id')
      .notEmpty()
      .withMessage('pls provide id of admin you want to update'),
    body('roleId').notEmpty().withMessage('pls write RoleId of the admin'),
  ];

  static getSingleAdminDetailValidation = [
    param('id').custom((value, { req }) => {
      return Common.checkIsValidMongoId(req.params?.id);
    }),
  ];
  static getAdminRoleByIdValidation = [
    param('id').custom((value, { req }) => {
      return Common.checkIsValidMongoId(req.params?.id);
    }),
  ];

  static getListByStatusValidation = [
    query('isActive')
      .isBoolean()
      .withMessage('isActive value is required which is bool'),
    //query('isSuperAdmin').isBoolean().withMessage('isSuperAdmin value is required which is bool'),
  ];

  static updateAdminStatusValidation = [
    param('id').custom((value, { req }) => {
      return Common.checkIsValidMongoId(req.params?.id);
    }),
  ];

  static getAdminListValidation = [
    query('pageNo').isInt().withMessage('pageNo is required as type int'),
    query('limit').isInt().withMessage('limit is required as type int'),
  ];

  static forgotPasswordValidation = [
    body('email').isEmail().withMessage('email must be valid'),
  ];

  static forgotPasswordVerificationValidation = [
    body('code').notEmpty().withMessage('code is required'),
    body('password')
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage('password must be between 4 and 20 characters'),
  ];

  static changePasswordValidation = [
    body('oldPassword')
      .trim()
      .isLength({ min: 7, max: 20 })
      .withMessage('password must be between 4 to 20 characters'),
    body('newPassword')
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage('newPassword must be between 4 to 20 characters')
      .custom((value, { req }) => value !== req.body.oldPassword)
      .withMessage('oldPassword & newPassword should not match'),
  ];
}
