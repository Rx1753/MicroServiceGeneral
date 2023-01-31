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
  '/api/users/admin/create/role',
  verifyAdminToken,
  Validation.createRoleValidation,
  validateRequest,
  AdminDomain.createRole
);

//Update the role with permissions
router.put(
  '/api/users/admin/update/rolepermissions',
  verifyAdminToken,
  Validation.updateRolePermissionValidation,
  validateRequest,
  AdminDomain.updateRolePermissions
);

//Add admin user by super admin
router.post(
  '/api/users/admin/addadmin',
  verifyAdminToken,
  Validation.addAdminValidation,
  validateRequest,
  AdminDomain.addAdmin
);
//Add user with new role by admin/superadmin
router.post(
  '/api/users/admin/adduser',
  verifyAdminToken,
  Validation.addAdminValidation,
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
  '/api/users/admin/update/adminrole',
  verifyAdminToken,
  Validation.updateAdminRoleValidation,
  validateRequest,
  AdminDomain.updateAdminRole
);

//Single User Detail
router.get(
  '/api/users/admin/getadmins/:id',
  verifyAdminToken,
  AdminDomain.getUserById
);
router.get(
  '/api/users/admin/getadminroles/:id',
  verifyAdminToken,
  AdminDomain.getAdminRoles
);

// All list
router.get(
  '/api/users/admin/getadmins',
  verifyAdminToken,
  validateRequest,
  AdminDomain.getAdminList
);
router.get(
  '/api/users/admin/getlistbystatus',
  verifyAdminToken,
  Validation.getListByStatusValidation,
  validateRequest,
  AdminDomain.getAdminByStatus
);
router.get(
  '/api/users/admin/getadminroles',
  verifyAdminToken,
  AdminDomain.getAdminRolesList
);

// Active/InActive status
router.put(
  '/api/users/admin/updatestatus/:id',
  verifyAdminToken,
  AdminDomain.statusUpdateForAdmin
);

// Search
router.get(
  '/api/users/admin/getadminbyname',
  verifyAdminToken,
  AdminDomain.getAdminByName
);

//forgot password
router.post(
  '/api/users/admin/forgotpassword/sendotp',
  verifyAdminToken,
  Validation.forgotPasswordValidation,
  validateRequest,
  AdminDomain.forgotPassword
);

router.post(
  '/api/users/admin/forgotpassword/verifyotp',
  verifyAdminToken,
  Validation.forgotPasswordVerificationValidation,
  validateRequest,
  AdminDomain.forgotPasswordVerification
);

router.post('/api/users/admin/sendemail', async (req: any, res: any) => {
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

router.post('/api/users/admin/sendsms', async (req: any, res: any) => {
  await SendSmsService.sendSms(
    'This is the first content sms',
    '+919974146404'
  );
  res.send({
    msg: 'Sms send sucess',
  });
});

export { router as adminAuthRouter };
