const statusCodeSuccess = 200; //Successful.
const statusCodeCreated = 201; //Created.
const statusCodeBadReq = 400; //Bad input parameter. Error message should indicate which one and why.
const statusCodeUnAuthorized = 401; //The client passed in the invalid Auth token. Client should refresh the token and then try again.
const statusCodeForbidden = 403; //* Customer doesn’t exist. * Application not registered. * Application try to access to properties not belong to an App. * Application try to trash/purge root node. * Application try to update contentProperties. * Operation is blocked (for third-party apps). * Customer account over quota.
const statusCodeNotFound = 404; //Resource not found.
const statusCodeMethodNotAllowed = 405; //The resource doesn't support the specified HTTP verb.
const statusCodeConflict = 409; //Conflict
const statusCodeInternalServer = 500; //Servers are not working as expected. The request is probably valid but needs to be requested again later.

const SUCCESS_200 = statusCodeSuccess;
const CREATED_SUCCESS_201 = statusCodeCreated;
const BAD_REQUEST_400 = statusCodeBadReq;
const UNAUTHORIZED_401 = statusCodeUnAuthorized;
const FORBIDDEN_403 = statusCodeForbidden;
const NOT_FOUND_404 = statusCodeNotFound;
const METHOD_NOT_ALLOWED_405 = statusCodeMethodNotAllowed;
const CONFLICT_409 = statusCodeConflict;
const INTERNAL_SERVER_ERROR_500 = statusCodeInternalServer;

export {
  SUCCESS_200,
  CREATED_SUCCESS_201,
  BAD_REQUEST_400,
  UNAUTHORIZED_401,
  FORBIDDEN_403,
  NOT_FOUND_404,
  METHOD_NOT_ALLOWED_405,
  CONFLICT_409,
  INTERNAL_SERVER_ERROR_500,
};
