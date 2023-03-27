const Exception = require('./exception')
const { ERROR_TYPE } = require('./constants')

module.exports = {
  internalServerError(msg, err) {
    return new Exception(
      ERROR_TYPE.INTERNAL,
      msg || 'Internal server error, Please try after some time.',
      err,
    )
  },
  badRequestError(msg, err) {
    return new Exception(ERROR_TYPE.BAD_REQUEST, msg || 'Bad request', err)
  },
  unAuthenticatedAccess(msg, err) {
    return new Exception(
      ERROR_TYPE.UNAUTHORIZED,
      msg || 'Unauthorized access',
      err,
    )
  },
  forbiddenAccess(msg, err) {
    return new Exception(
      ERROR_TYPE.FORBIDDEN,
      msg || 'Forbidden access',
      err,
    )
  },
  notFoundError(msg, err) {
    return new Exception(ERROR_TYPE.NOT_FOUND, msg || 'No route found', err)
  },
  notAllowedError(msg, err) {
    return new Exception(
      ERROR_TYPE.NOT_ALLOWED,
      msg || 'Method not allowed',
      err,
    )
  },
  alreadyExistError(msg, err) {
    return new Exception(
      ERROR_TYPE.ALREADY_EXISTS,
      msg || 'Already Exists',
      err,
    )
  },
}
