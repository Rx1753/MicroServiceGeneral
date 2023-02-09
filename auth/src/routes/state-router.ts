import { validateRequest } from '@rx-projects/common';
import express, { Request, Response, Router } from 'express';
import { StateDomain } from '../domain/state-domain';
import { verifyAdminToken } from '../middlewares/current-user';
import { StateValidation } from '../validations/state-validation';

const router = express.Router();
const baseUrl = `/api/users/state`;

//ADMIN Middleware

//add state
router.post(
  `${baseUrl}/create`,verifyAdminToken,StateValidation.stateCreateValidation,validateRequest,
  StateDomain.createState
);

//update state
router.put(
  `${baseUrl}/update/:id`,verifyAdminToken,StateValidation.stateUpdateValidation,validateRequest,
  StateDomain.updateState
);

//delete state
router.delete(
  `${baseUrl}/delete/:id`,verifyAdminToken,StateValidation.stateDeleteValidation,validateRequest,
  StateDomain.deleteState
);

// get all States
router.get(`${baseUrl}/getstates`, StateDomain.getStateList);

router.get(
  `${baseUrl}/getlistbystatus`,StateValidation.getListByStatusValidation,validateRequest,
  StateDomain.getListBystatus
);

router.get(
  `${baseUrl}/getlistbyname`,StateValidation.getStateByNameValidation,validateRequest,
  StateDomain.getStateByName
);

export { router as stateRouter };
