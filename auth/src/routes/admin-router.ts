import express from 'express';
import { validateRequest } from '@rx-projects/common';
import { AdminDomain } from '../domain/admin-domain';

import { Validation } from '../validations/admin-validation';

const router = express.Router();

router.post(
  '/api/users/admin/permission',
  Validation.addPermissionsValidation,
  validateRequest,
  AdminDomain.addPermissions
);

router.post(
  '/api/users/admin/createRole',
  Validation.createRoleValidation,
  validateRequest,
  AdminDomain.createRole
);



//Add admin user
router.post(
  '/api/users/admin/addAdmin',
  Validation.addAdminValidation,
  validateRequest,
  AdminDomain.addAdmin
);

export { router as adminAuthRouter };
