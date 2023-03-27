export class TagNotFoundException extends Error {
  name:any;
  code:any;
  title:any;
  tagId:any;
  constructor(tagId:any) {
    super(`Tag ${tagId} Not Found`);
    this.name = 'TagNotFoundException';
    this.code = 404;
    this.title = `Invalid tag`;
    this.tagId = tagId;
    this.message = `Tag ${tagId} Not Found`;
    Error.captureStackTrace(this, TagNotFoundException);
  }
}

export class RollingCodeValidationException extends Error {
  name:any;
  code:any;
  title:any;
  tagId:any;
  constructor(tagId:any, title:any) {
    super(`Tag ${tagId} Validation Error`);
    this.name = 'RollingCodeValidationException';
    this.code = 400;
    this.title = title;
    this.tagId = tagId;
    this.message = `Tag ${tagId} Validation Error`;
    Error.captureStackTrace(this, RollingCodeValidationException);
  }
}

export class TagNotActivatedException extends Error {
   name:any;
   code:any;
   title:any;
   tagId:any;
  constructor(tagId:any, title:any) {
    super(`Tag ${tagId} Not Activated Error`);
    this.name = 'TagNotActivatedException';
    this.code = 400;
    this.title = title;
    this.tagId = tagId;
    this.message = `Tag ${tagId} Not Activated Error`;
    Error.captureStackTrace(this, TagNotActivatedException);
  }
}

export class InvalidGRPCMethodArgsException extends Error {
  name:any;
  code:any;
  message:any;
  constructor({method, args}:any) {
    super(`Missing rollingcode ${method} method argument(s): ${JSON.stringify(args)}`);
    this.name = 'InvalidGRPCMethodArgsException';
    this.code = 400;
    this.message = `Missing rollingcode ${method} method argument(s): ${JSON.stringify(args)}`;
    Error.captureStackTrace(this, InvalidGRPCMethodArgsException);
  }
}
