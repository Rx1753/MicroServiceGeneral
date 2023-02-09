import express, { Request, Response, Router } from 'express';
import { verifyCustomerActiveToken, verifyToken } from '../middlewares/current-user';
import { validateRequest } from '@rx-projects/common';
import { CustomerAuthValidation } from '../validations/customer-validation';
import { CustomerDomain } from '../domain/customer-domain';

const router = express.Router();
var baseUrl = `/api/users/customer`;

//sign up
router.post(
  `${baseUrl}/signup`,CustomerAuthValidation.signupValidation,validateRequest,CustomerDomain.signUp
);

//sign in
router.post(
  `${baseUrl}/signin`,CustomerAuthValidation.signInValidation,validateRequest,CustomerDomain.signIn
);

router.put(
  `${baseUrl}/updateprofile/:id`,verifyCustomerActiveToken,CustomerAuthValidation.updateProfileValidation,validateRequest,
  CustomerDomain.updateProfile
);

router.post(
  `${baseUrl}/changepassword`,verifyCustomerActiveToken,CustomerAuthValidation.changePasswordValidation,validateRequest,
  CustomerDomain.changePassword
);

router.post(
  `${baseUrl}/forgotpassword/sendotp`,CustomerAuthValidation.forgotPasswordValidation,validateRequest,
  CustomerDomain.forgotPasswordSendOtp
);

router.post(
  `${baseUrl}/forgotpassword/verifyotp`,CustomerAuthValidation.forgotPasswordVerificationValidation,validateRequest,
  CustomerDomain.forgotPasswordVerifyOtp
);

router.delete(
  `${baseUrl}/delete/:id`,verifyCustomerActiveToken,CustomerAuthValidation.deleteCustomer,validateRequest,
  CustomerDomain.deleteCustomer
);

//isMfa active
router.post(
  `${baseUrl}/mfa`,verifyCustomerActiveToken,CustomerAuthValidation.checkMFA,validateRequest,
  CustomerDomain.checkMFA
);

router.post(
  `${baseUrl}/mfa/sendemail`,verifyCustomerActiveToken,CustomerAuthValidation.sendEmailMFA,validateRequest,
  CustomerDomain.sendEmailMFA
);

router.post(
  `${baseUrl}/mfa/sendsms`,verifyCustomerActiveToken,CustomerAuthValidation.sendSmsMFA,validateRequest,
  CustomerDomain.sendSmsMFA
);

router.post(
  `${baseUrl}/mfa/verifyemail`,verifyCustomerActiveToken,CustomerAuthValidation.verifyEmailValidation,validateRequest,
  CustomerDomain.verifyEmail
);
router.post(
  `${baseUrl}/mfa/verifyphone`,verifyCustomerActiveToken,CustomerAuthValidation.verifyPhoneNumberValidation,validateRequest,
  CustomerDomain.verifyPhoneNumber
);

//customers list
router.get(`${baseUrl}/getcustomers`, verifyToken, CustomerDomain.getCustomers);

router.get(
  `${baseUrl}/getlistbystatus`,verifyToken,CustomerAuthValidation.getListByStatusValidation,validateRequest,
  CustomerDomain.getCustomerByStatus
);

router.get(
  `${baseUrl}/getlistbyname`,verifyToken,CustomerAuthValidation.getListByNameValidation,validateRequest,
  CustomerDomain.getCustomerByName
);

router.get(
  `${baseUrl}/deletedcustomers`,verifyToken,CustomerDomain.getListOfDeletedAccounts
);

router.get(
  `${baseUrl}/currentuser`,verifyCustomerActiveToken,CustomerDomain.currentLoginUser
);

router.get(
  `${baseUrl}/refreshtoken`,verifyCustomerActiveToken,CustomerDomain.getRefreshToken
);

router.post(`${baseUrl}/signout`, verifyCustomerActiveToken, CustomerDomain.signOut);

export { router as customerRouter };
