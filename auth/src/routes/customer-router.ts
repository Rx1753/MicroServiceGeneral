import express, { Request, Response, Router } from 'express';
import { verifyCustomerActiveToken, verifyToken } from '../middlewares/current-user';
import { validateRequest } from '@rx-projects/common';
import { CustomerAuthValidation } from '../validations/customer-validation';
import { CustomerDomain } from '../domain/customer-domain';
import { SwaggerTags } from '../services/set-swagger-tags';

const router = express.Router();

//sign up
router.post(
  `/signup`,CustomerAuthValidation.signupValidation,validateRequest,
  SwaggerTags.customerTag,
  CustomerDomain.signUp
);

//sign in
router.post(
  `/signin`,CustomerAuthValidation.signInValidation,validateRequest,
  SwaggerTags.customerTag,
  CustomerDomain.signIn
);

router.put(
  `/updateprofile/:id`,verifyCustomerActiveToken,CustomerAuthValidation.updateProfileValidation,validateRequest,
  SwaggerTags.customerTag,
  CustomerDomain.updateProfile
);

router.post(
  `/changepassword`,verifyCustomerActiveToken,CustomerAuthValidation.changePasswordValidation,validateRequest,
  SwaggerTags.customerTag,
  CustomerDomain.changePassword
);

router.post(
  `/forgotpassword/sendotp`,CustomerAuthValidation.forgotPasswordValidation,validateRequest,
  SwaggerTags.customerTag,
  CustomerDomain.forgotPasswordSendOtp
);

router.post(
  `/forgotpassword/verifyotp`,CustomerAuthValidation.forgotPasswordVerificationValidation,validateRequest,
  SwaggerTags.customerTag,
  CustomerDomain.forgotPasswordVerifyOtp
);

router.delete(
  `/delete/:id`,verifyCustomerActiveToken,CustomerAuthValidation.deleteCustomer,validateRequest,
  SwaggerTags.customerTag,
  CustomerDomain.deleteCustomer
);

//isMfa active
router.post(
  `/mfa`,verifyCustomerActiveToken,CustomerAuthValidation.checkMFA,validateRequest,
  SwaggerTags.customerTag,
  CustomerDomain.checkMFA
);

router.post(
  `/mfa/sendemail`,verifyCustomerActiveToken,CustomerAuthValidation.sendEmailMFA,validateRequest,
  SwaggerTags.customerTag,
  CustomerDomain.sendEmailMFA
);

router.post(
  `/mfa/sendsms`,verifyCustomerActiveToken,CustomerAuthValidation.sendSmsMFA,validateRequest,
  SwaggerTags.customerTag,
  CustomerDomain.sendSmsMFA
);

router.post(
  `/mfa/verifyemail`,verifyCustomerActiveToken,CustomerAuthValidation.verifyEmailValidation,validateRequest,
  SwaggerTags.customerTag,
  CustomerDomain.verifyEmail
);
router.post(
  `/mfa/verifyphone`,verifyCustomerActiveToken,CustomerAuthValidation.verifyPhoneNumberValidation,validateRequest,
  SwaggerTags.customerTag,
  CustomerDomain.verifyPhoneNumber
);

//customers list
router.get(`/getcustomers`, verifyToken, SwaggerTags.customerTag, CustomerDomain.getCustomers);

router.get(
  `/getlistbystatus`,verifyToken,CustomerAuthValidation.getListByStatusValidation,validateRequest,
  SwaggerTags.customerTag,
  CustomerDomain.getCustomerByStatus
);

router.get(
  `/getlistbyname`,verifyToken,CustomerAuthValidation.getListByNameValidation,validateRequest,
  SwaggerTags.customerTag,
  CustomerDomain.getCustomerByName
);

router.get(
  `/deletedcustomers`,verifyToken, SwaggerTags.customerTag,CustomerDomain.getListOfDeletedAccounts
);

router.get(
  `/currentuser`,verifyCustomerActiveToken, SwaggerTags.customerTag,CustomerDomain.currentLoginUser
);

router.get(
  `/refreshtoken`,verifyCustomerActiveToken, SwaggerTags.customerTag,CustomerDomain.getRefreshToken
);

router.post(`/signout`, verifyCustomerActiveToken, SwaggerTags.customerTag, CustomerDomain.signOut);

export { router as customerRouter };
