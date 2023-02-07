import express, { Request, Response, Router } from 'express';
import { verifyCustomerToken, verifyToken } from '../middlewares/current-user';
import { validateRequest } from '@rx-projects/common';
import { CustomerAuthValidation } from '../validations/customer-validation';
import { CustomerDomain } from '../domain/customer-domain';

const router = express.Router();

//sign up
router.post(
  '/api/users/customer/signup',
  CustomerAuthValidation.signupValidation,
  validateRequest,
  CustomerDomain.signUp
);

//sign in
router.post(
  '/api/users/customer/signin',
  CustomerAuthValidation.signInValidation,
  validateRequest,
  CustomerDomain.signIn
);

router.put(
  '/api/users/customer/updateprofile/:id',
  verifyCustomerToken,
  CustomerAuthValidation.updateProfileValidation,
  validateRequest,
  CustomerDomain.updateProfile
);

router.post(
  '/api/users/customer/changepassword',
  verifyCustomerToken,
  CustomerAuthValidation.changePasswordValidation,
  validateRequest,
  CustomerDomain.changePassword
);

router.post(
  '/api/users/customer/forgotpassword/sendotp',
  CustomerAuthValidation.forgotPasswordValidation,
  validateRequest,
  CustomerDomain.forgotPasswordSendOtp
);

router.post(
  '/api/users/customer/forgotpassword/verifyotp',
  CustomerAuthValidation.forgotPasswordVerificationValidation,
  validateRequest,
  CustomerDomain.forgotPasswordVerifyOtp
);

router.delete(
  '/api/users/customer/delete/:id',
  verifyCustomerToken,
  CustomerAuthValidation.deleteCustomer,
  validateRequest,
  CustomerDomain.deleteCustomer
);

//isMfa active
router.post(
  '/api/users/customer/mfa',
  verifyCustomerToken,
  CustomerAuthValidation.checkMFA,
  validateRequest,
  CustomerDomain.checkMFA
);

router.post(
  '/api/users/customer/mfa/sendemail',
  verifyCustomerToken,
  CustomerDomain.sendEmailMFA
);

router.post(
  '/api/users/customer/mfa/sendsms',
  verifyCustomerToken,
  CustomerDomain.sendSmsMFA
);

router.post(
  '/api/users/customer/verifyemail',
  verifyCustomerToken,
  CustomerAuthValidation.verifyEmailValidation,
  validateRequest,
  CustomerDomain.verifyEmail
);
router.post(
  '/api/users/customer/verifyphone',
  verifyCustomerToken,
  CustomerAuthValidation.verifyPhoneNumberValidation,
  validateRequest,
  CustomerDomain.verifyPhoneNumber
);

//customers list
router.get('/api/users/customer/getcustomers', CustomerDomain.getCustomers);

router.get(
  '/api/users/customer/getlistbystatus',
  verifyToken,
  CustomerAuthValidation.getListByStatusValidation,
  validateRequest,
  CustomerDomain.getCustomerByStatus
);

router.get(
  '/api/users/customer/getlistbyname',
  verifyToken,
  CustomerAuthValidation.getListByNameValidation,
  validateRequest,
  CustomerDomain.getCustomerByName
);

router.get(
  '/api/users/customer/deletedcustomers',
  verifyToken,
  CustomerDomain.getListOfDeletedAccounts
);

router.get(
  '/api/users/customer/currentuser',
  verifyCustomerToken,
  CustomerDomain.currentLoginUser
);

router.get(
  '/api/users/customer/refreshtoken',
  verifyCustomerToken,
  CustomerDomain.getRefreshToken
);

router.post(
  '/api/users/customer/signout',
  verifyCustomerToken,
  CustomerDomain.signOut
);

export { router as customerRouter };
