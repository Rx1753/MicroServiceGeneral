import { validateRequest } from '@rx-projects/common';
import express, { Request, Response, Router } from 'express';
import { StateDomain } from '../domain/state-domain';
import { verifyAdminToken,verifyToken } from '../middlewares/current-user';
import { SwaggerTags } from '../services/set-swagger-tags';
import { StateValidation } from '../validations/state-validation';

const router = express.Router();

//ADMIN Middleware

//add state
router.post(
  `/create`,verifyAdminToken,StateValidation.stateCreateValidation,validateRequest,
  SwaggerTags.stateTag,
  StateDomain.createState
);

//update state
router.put(
  `/update/:id`,verifyAdminToken,StateValidation.stateUpdateValidation,validateRequest,
  SwaggerTags.stateTag,
  StateDomain.updateState
);

//delete state
router.delete(
  `/delete/:id`,verifyAdminToken,StateValidation.stateDeleteValidation,validateRequest,
  SwaggerTags.stateTag,
  StateDomain.deleteState
);

// get all States
router.get(`/getstates`, verifyToken, SwaggerTags.stateTag, StateDomain.getStateList);

router.get(
  `/getlistbystatus`, verifyToken, StateValidation.getListByStatusValidation,validateRequest,
  SwaggerTags.stateTag,
  StateDomain.getListBystatus
);

router.get(
  `/getlistbyname`, verifyToken, StateValidation.getStateByNameValidation,validateRequest,
  SwaggerTags.stateTag,
  StateDomain.getStateByName
);

export { router as stateRouter };
