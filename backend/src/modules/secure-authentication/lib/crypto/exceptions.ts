export  class InvalidKeyException extends Error {
  constructor(message:any) {
    super(message);
    this.name = 'InvalidKeyException';
    Error.captureStackTrace(this, InvalidKeyException);
  }
}

export  class InvalidAlgorithmParameterException extends Error {
  constructor(message:any) {
    super(message);
    this.name = 'InvalidAlgorithmParameterException';
    Error.captureStackTrace(this, InvalidAlgorithmParameterException);
  }
}

export  class IllegalStateException extends Error {
  constructor(message:any) {
    super(message);
    this.name = 'IllegalStateException';
    Error.captureStackTrace(this, IllegalStateException);
  }
}

export  class NumberFormatException extends Error {
  constructor(message:any) {
    super(message);
    this.name = 'NumberFormatException';
    Error.captureStackTrace(this, NumberFormatException);
  }
}

export  class GeneralSecurityException extends Error {
  constructor(message:any) {
    super(message);
    this.name = 'GeneralSecurityException';
    Error.captureStackTrace(this, GeneralSecurityException);
  }
}

