import { BadRequestError } from '@rx-projects/common';
import { body, check, oneOf, query } from 'express-validator';

export class Validation {
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
      'One Of field is Require Email or PhoneNumber'
    ),
  ];

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
      'One Of field is Require Email or PhoneNumber'
    ),
  ];

  static addPermissionsValidation = [
    body('tableName').notEmpty().withMessage('Please provide tableName'),
    body('isRead').isBoolean().withMessage('isRead is required'),
    body('isUpdate').isBoolean().withMessage('isUpdate is required'),
    body('isDelete').isBoolean().withMessage('isDelete is required'),
    body('isCreate').isBoolean().withMessage('isCreate is required'),
  ];

  static createRoleValidation = [
    body('roleName').notEmpty().withMessage('Please provide tableName'),
    body('permissionId').notEmpty().withMessage('permissionId is required'),
  ];

  static updateRolePermissionValidation = [
    body('roleId').notEmpty().withMessage('Please provide roleId'),
    body('permissionId').notEmpty().withMessage('permissionId is required'),
  ];

  static updateAdminRoleValidation = [
    body('id')
      .notEmpty()
      .withMessage('pls provide id of admin you want to update'),
    body('roleId').notEmpty().withMessage('pls write RoleId of the admin'),
  ];

  static getListByStatusValidation = [
    query('isActive')
      .isBoolean()
      .withMessage('isActive value is required which is bool'),
    //query('isSuperAdmin').isBoolean().withMessage('isSuperAdmin value is required which is bool'),
  ];

  static getAdminListValidation = [
    query('pageNo').isInt().withMessage('pageNo is required as type int'),
    query('limit').isInt().withMessage('limit is required as type int'),
  ];
}
