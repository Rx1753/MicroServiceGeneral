"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const express_validator_1 = require("express-validator");
const request_validation_error_1 = require("../errors/request-validation-error");
const validateRequest = (req, res, next) => {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        throw new request_validation_error_1.RequestValidationError(error.array());
    }
    next();
};
exports.validateRequest = validateRequest;
