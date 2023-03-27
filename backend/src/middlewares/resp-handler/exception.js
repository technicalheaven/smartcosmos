class Exception {
    constructor(errType, message, stackTrace) {
      this.errType = errType;
      this.message = message;
      if (stackTrace) {
        this.err = stackTrace;
      }
    }
  }

module.exports = Exception 