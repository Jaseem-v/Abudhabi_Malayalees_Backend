class ThrowError extends Error {
    statusCode;
    code;
    constructor(message: string, statusCode?: number, code?: number | string) {
      super(message);
      this.statusCode = statusCode;
      this.code = code;
  
      // Maintains proper stack trace for where our error was thrown (only available on V8)
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, ThrowError);
      }
    }
  }

  export default ThrowError;