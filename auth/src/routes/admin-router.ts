import express from 'express';
import { validateRequest } from '@rx-projects/common';
import { AdminDomain } from '../domain/admin-domain';
import { Validation } from '../validations/admin-validation';
import { verifyAdminToken } from '../middlewares/current-user';
import { MailService } from '../services/mail-service';
import { HtmlTemplate } from '../services/html-templates';
import { SendSmsService } from '../services/send-sms-service';

const router = express.Router();

//Add permissions with Table name
router.post(
  '/api/users/admin/permission',
  Validation.addPermissionsValidation,
  verifyAdminToken,
  validateRequest,
  AdminDomain.addPermissions
);

//Create role with permissions
router.post(
  '/api/users/admin/createRole',
  Validation.createRoleValidation,
  verifyAdminToken,
  validateRequest,
  AdminDomain.createRole
);

//Update the role with permissions
router.put(
  '/api/users/admin/updateRolePermissions',
  Validation.updateRolePermissionValidation,
  verifyAdminToken,
  validateRequest,
  AdminDomain.updateRolePermissions
);

//Add admin user by super admin
router.post(
  '/api/users/admin/addAdmin',
  Validation.addAdminValidation,
  verifyAdminToken,
  validateRequest,
  AdminDomain.addAdmin
);
//Add user with new role by admin/superadmin
router.post(
  '/api/users/admin/addUser',
  Validation.addAdminValidation,
  verifyAdminToken,
  validateRequest,
  AdminDomain.addNewUser
);

//Admin Sign In
router.post(
  '/api/users/admin/login',
  Validation.signInValidation,
  validateRequest,
  AdminDomain.signIn
);

//Update Admin Role
router.put(
  '/api/users/admin/updateAdminRole',
  Validation.updateAdminRoleValidation,
  verifyAdminToken,
  validateRequest,
  AdminDomain.updateAdminRole
);

//Single User Detail
router.get(
  '/api/users/admin/getAdminDetails/:id',
  verifyAdminToken,
  AdminDomain.getUserById
);
router.get(
  '/api/users/admin/getAdminRoles/:id',
  verifyAdminToken,
  AdminDomain.getAdminRoles
);

router.get(
  '/api/users/admin/getList',
  verifyAdminToken,
  validateRequest,
  AdminDomain.getAdminList
);
router.get(
  '/api/users/admin/getListByStatus',
  Validation.getListByStatusValidation,
  verifyAdminToken,
  validateRequest,
  AdminDomain.getAdminByStatus
);
router.get(
  '/api/users/admin/getAdminRolesList',
  verifyAdminToken,
  AdminDomain.getAdminRolesList
);

// Active/InActive status
router.put(
  '/api/users/admin/statusUpdate/:id',
  verifyAdminToken,
  AdminDomain.statusUpdateForAdmin
);

// Search
router.get(
  '/api/users/admin/getAdminByName',
  verifyAdminToken,
  AdminDomain.getAdminByName
);

//forgot password
router.post(
  '/api/users/admin/forgotPassword/sendOtp',
  Validation.forgotPasswordValidation,
  verifyAdminToken,
  validateRequest,
  AdminDomain.forgotPassword
);

router.post(
  '/api/users/admin/forgotPassword/verifyOtp',
  Validation.forgotPasswordVerificationValidation,
  verifyAdminToken,
  validateRequest,
  AdminDomain.forgotPasswordVerification
);

router.post('/api/users/admin/sendEmail', async (req: any, res: any) => {
  var email = 'admin@gmail.com';
  var password = '12345678';
  var html = HtmlTemplate.sendEmailWithCredentials('Test', email, password);
  await MailService.mailTrigger(
    'radixdt.1753@gmail.com',
    'Admin Credentials',
    html
  );
  res.send({
    msg: 'Mail sucess',
  });
});

router.post('/api/users/admin/sendSms', async (req: any, res: any) => {
  await SendSmsService.sendSms(
    'This is the first content sms',
    '+919974146404'
  );
  res.send({
    msg: 'Sms send sucess',
  });
});

export { router as adminAuthRouter };
