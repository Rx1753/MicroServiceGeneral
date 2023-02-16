import express from 'express';
import { validateRequest } from '@rx-projects/common';
import { AdminDomain } from '../domain/admin-domain';
import { Validation } from '../validations/admin-validation';
import { verifyAdminToken } from '../middlewares/current-user';
import { MailService } from '../services/mail-service';
import { HtmlTemplate } from '../services/html-templates';
import { SendSmsService } from '../services/send-sms-service';
import { SwaggerTags } from '../services/set-swagger-tags';

const router = express.Router();

//Add permissions with Table name
router.post(
  `/permission`,verifyAdminToken,Validation.addPermissionsValidation,validateRequest,
  SwaggerTags.adminTag,
  AdminDomain.addPermissions
);

//Create role with permissions
router.post(
  `/create/role`,verifyAdminToken,Validation.createRoleValidation,validateRequest,
  SwaggerTags.adminTag,
  AdminDomain.createRole
);

//Update the role with permissions
router.put(
  `/update/rolepermissions`,verifyAdminToken,Validation.updateRolePermissionValidation,validateRequest,
  SwaggerTags.adminTag,
  AdminDomain.updateRolePermissions
);

//Add admin user by super admin
router.post(
  `/addadmin`,verifyAdminToken,Validation.addAdminValidation,validateRequest,
  SwaggerTags.adminTag,
  AdminDomain.addAdmin
);
//Add user with new role by admin/superadmin
router.post(
  `/adduser`,verifyAdminToken,Validation.addAdminValidation,validateRequest,
  SwaggerTags.adminTag,
  AdminDomain.addNewUser
);

//Admin Sign In
router.post(
  `/login`,Validation.signInValidation,validateRequest,
  SwaggerTags.adminTag,
  AdminDomain.signIn
);

//Update Admin Role
router.put(
  `/update/adminrole`,verifyAdminToken,Validation.updateAdminRoleValidation,validateRequest,
  SwaggerTags.adminTag,
  AdminDomain.updateAdminRole
);

// Active/InActive status
router.put(
  `/updatestatus/:id`,verifyAdminToken,Validation.updateAdminStatusValidation,validateRequest,
  SwaggerTags.adminTag,
  AdminDomain.statusUpdateForAdmin
);

//Single User Detail
router.get(
  `/getadmins/:id`,verifyAdminToken,Validation.getSingleAdminDetailValidation,validateRequest,
  SwaggerTags.adminTag,
  AdminDomain.getUserById
);
router.get(
  `/getadminroles/:id`,verifyAdminToken,Validation.getAdminRoleByIdValidation,validateRequest,
  SwaggerTags.adminTag,
  AdminDomain.getAdminRoles
);

// All list
// permissions
router.get(
  `/getpermissions`,verifyAdminToken,
  SwaggerTags.adminTag,
  AdminDomain.getPermissions
);

router.get(
  `/getadmins`,verifyAdminToken,validateRequest,
  SwaggerTags.adminTag,
  AdminDomain.getAdminList
);

router.get(
  `/getadminroles`,verifyAdminToken,
  SwaggerTags.adminTag,
  AdminDomain.getAdminRolesList
);

router.get(
  `/getlistbystatus`,verifyAdminToken,Validation.getListByStatusValidation,validateRequest,
  SwaggerTags.adminTag,
  AdminDomain.getAdminByStatus
);

// Search
router.get(
  `/getadminbyname`,verifyAdminToken,
  SwaggerTags.adminTag,
  AdminDomain.getAdminByName
);

//forgot password
router.post(
  `/forgotpassword/sendotp`,verifyAdminToken,Validation.forgotPasswordValidation,validateRequest,
  SwaggerTags.adminTag,
  AdminDomain.forgotPassword
);

router.post(
  `/forgotpassword/verifyotp`,verifyAdminToken,Validation.forgotPasswordVerificationValidation,validateRequest,
  SwaggerTags.adminTag,
  AdminDomain.forgotPasswordVerification
);

//change password
router.post(
  `/changepassword`,verifyAdminToken,Validation.changePasswordValidation,validateRequest,
  SwaggerTags.adminTag,
  AdminDomain.changePassword
);

// router.post(`/sendemail`, async (req: any, res: any) => {
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

// router.post(`/sendsms`, async (req: any, res: any) => {
//   await SendSmsService.sendSms(
//     'This is the first content sms',
//     '+919974146404'
//   );
//   res.send({
//     msg: 'Sms send sucess',
//   });
// });

export { router as adminAuthRouter };
