import HTTPStatus from 'http-status';

class BaseException extends Error {
  code;
  message;
  error;

  constructor(code:any, message:any, error:any) {
    super(`${code}, ${message}, ${error}`);
    this.code = code;
    this.message = message;
    this.error = error || undefined;
    Error.captureStackTrace(this);
  }

  toErrorObject() {
    return {
      code: this.code,
      message: this.message,
      error: this.error,
    };
  }
}

class BadRequestException extends BaseException {
  constructor(error:any, code = HTTPStatus.BAD_REQUEST, message = HTTPStatus[HTTPStatus.BAD_REQUEST]) {
    super(code, message, error);
  }
}

class ConflictException extends BaseException {
  constructor(error:any, code = HTTPStatus.CONFLICT, message = HTTPStatus[HTTPStatus.CONFLICT]) {
    super(code, message, error);
  }
}

class NotFoundException extends BaseException {
  constructor(error:any, code = HTTPStatus.NOT_FOUND, message = HTTPStatus[HTTPStatus.NOT_FOUND]) {
    super(code, message, error);
  }
}

class UnauthorizedException extends BaseException {
  constructor(error:any, code = HTTPStatus.UNAUTHORIZED, message = HTTPStatus[HTTPStatus.UNAUTHORIZED]) {
    super(code, message, error);
  }
}

class MethodNotAllowedException extends BaseException {
  constructor(error:any, code = HTTPStatus.METHOD_NOT_ALLOWED, message = HTTPStatus[HTTPStatus.METHOD_NOT_ALLOWED]) {
    super(code, message, error);
  }
}

class MethodNotImplemented extends BaseException {
  constructor(error:any, code = HTTPStatus.NOT_IMPLEMENTED, message = HTTPStatus[HTTPStatus.NOT_IMPLEMENTED]) {
    super(code, message, error);
  }
}

class UnsupportedMediaTypeException extends BaseException {
  constructor(
    error:any,
    code = HTTPStatus.UNSUPPORTED_MEDIA_TYPE,
    message = HTTPStatus[HTTPStatus.UNSUPPORTED_MEDIA_TYPE]
  ) {
    super(code, message, error);
  }
}

class InternalServerErrorException extends BaseException {
  constructor(error:any, code = HTTPStatus.INTERNAL_SERVER_ERROR, message = HTTPStatus[HTTPStatus.INTERNAL_SERVER_ERROR]) {
    super(code, message, error);
  }
}

export {
  BaseException,
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  MethodNotAllowedException,
  MethodNotImplemented,
  UnsupportedMediaTypeException,
  InternalServerErrorException,
};
