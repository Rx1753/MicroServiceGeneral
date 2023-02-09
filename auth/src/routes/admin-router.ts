import express from 'express';
import { validateRequest } from '@rx-projects/common';
import { AdminDomain } from '../domain/admin-domain';
import { Validation } from '../validations/admin-validation';
import { verifyAdminToken } from '../middlewares/current-user';
import { MailService } from '../services/mail-service';
import { HtmlTemplate } from '../services/html-templates';
import { SendSmsService } from '../services/send-sms-service';

const router = express.Router();
const baseUrl = `/api/users/admin`;

//Add permissions with Table name
router.post(
  `${baseUrl}/permission`,verifyAdminToken,Validation.addPermissionsValidation,validateRequest,
  AdminDomain.addPermissions
);

//Create role with permissions
router.post(
  `${baseUrl}/create/role`,verifyAdminToken,Validation.createRoleValidation,validateRequest,
  AdminDomain.createRole
);

//Update the role with permissions
router.put(
  `${baseUrl}/update/rolepermissions`,verifyAdminToken,Validation.updateRolePermissionValidation,validateRequest,
  AdminDomain.updateRolePermissions
);

//Add admin user by super admin
router.post(
  `${baseUrl}/addadmin`,verifyAdminToken,Validation.addAdminValidation,validateRequest,
  AdminDomain.addAdmin
);
//Add user with new role by admin/superadmin
router.post(
  `${baseUrl}/adduser`,verifyAdminToken,Validation.addAdminValidation,validateRequest,
  AdminDomain.addNewUser
);

//Admin Sign In
router.post(
  `${baseUrl}/login`,Validation.signInValidation,validateRequest,
  AdminDomain.signIn
);

//Update Admin Role
router.put(
  `${baseUrl}/update/adminrole`,verifyAdminToken,Validation.updateAdminRoleValidation,validateRequest,
  AdminDomain.updateAdminRole
);

// Active/InActive status
router.put(
  `${baseUrl}/updatestatus/:id`,verifyAdminToken,Validation.updateAdminStatusValidation,validateRequest,
  AdminDomain.statusUpdateForAdmin
);

//Single User Detail
router.get(
  `${baseUrl}/getadmins/:id`,verifyAdminToken,Validation.getSingleAdminDetailValidation,validateRequest,
  AdminDomain.getUserById
);
router.get(
  `${baseUrl}/getadminroles/:id`,verifyAdminToken,Validation.getAdminRoleByIdValidation,validateRequest,
  AdminDomain.getAdminRoles
);

// All list
router.get(
  `${baseUrl}/getadmins`,verifyAdminToken,validateRequest,
  AdminDomain.getAdminList
);
router.get(
  `${baseUrl}/getlistbystatus`,verifyAdminToken,Validation.getListByStatusValidation,validateRequest,
  AdminDomain.getAdminByStatus
);
router.get(
  `${baseUrl}/getadminroles`,verifyAdminToken,
  AdminDomain.getAdminRolesList
);

// Search
router.get(
  `${baseUrl}/getadminbyname`,verifyAdminToken,
  AdminDomain.getAdminByName
);

//forgot password
router.post(
  `${baseUrl}/forgotpassword/sendotp`,verifyAdminToken,Validation.forgotPasswordValidation,validateRequest,
  AdminDomain.forgotPassword
);

router.post(
  `${baseUrl}/forgotpassword/verifyotp`,verifyAdminToken,Validation.forgotPasswordVerificationValidation,validateRequest,
  AdminDomain.forgotPasswordVerification
);

// router.post(`${baseUrl}/sendemail`, async (req: any, res: any) => {
//   var email = 'admin@gmail.com';
//   var password = '12345678';
//   var html = HtmlTemplate.sendEmailWithCredentials('Test', email, password);
//   await MailService.mailTrigger(
//     'radixdt.1753@gmail.com',
//     'Admin Credentials',
//     html
//   );
//   res.send({
//     msg: 'Mail sucess',
//   });
// });

// router.post(`${baseUrl}/sendsms`, async (req: any, res: any) => {
//   await SendSmsService.sendSms(
//     'This is the first content sms',
//     '+919974146404'
//   );
//   res.send({
//     msg: 'Sms send sucess',
//   });
// });

export { router as adminAuthRouter };
