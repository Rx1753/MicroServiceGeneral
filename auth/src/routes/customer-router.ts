import express from 'express';
import { validateRequest } from '@rx-projects/common';
import { Validation } from '../validations/customer-validation';

const router = express.Router();

export { router as customerAuthRouter };
