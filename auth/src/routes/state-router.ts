import { validateRequest } from '@rx-projects/common';
import express, { Request, Response, Router } from 'express';
import { StateDomain } from '../domain/state-domain';
import { verifyAdminToken } from '../middlewares/current-user';
import { StateValidation } from '../validations/state-validation';

const router = express.Router();

//ADMIN Middleware

//add state
router.post(
  '/api/users/state/create',
  verifyAdminToken,
  StateValidation.stateCreateValidation,
  validateRequest,
  StateDomain.createState
);

//update state
router.put(
  '/api/users/state/update/:id',
  verifyAdminToken,
  StateValidation.stateUpdateValidation,
  validateRequest,
  StateDomain.updateState
);

//delete state
router.delete(
  '/api/users/state/delete/:id',
  verifyAdminToken,
  StateDomain.deleteState
);

// get all States
router.get('/api/users/state/getstates', StateDomain.getStateList);
router.get(
  '/api/users/state/getlistbystatus',
  StateValidation.getListByStatusValidation,
  validateRequest,
  StateDomain.getListBystatus
);

router.get(
  '/api/users/state/getlistbyname',
  StateValidation.getStateByNameValidation,
  validateRequest,
  StateDomain.getStateByName
);

export { router as stateRouter };
