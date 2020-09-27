class HttpException extends Error {
  status: number;
  message: string;
  errors: Array<string>;

  constructor(status: number, message: string = 'Error', errors?: Array<string>) {
    super(message);

    this.status = status;
    this.message = message;
    this.errors = errors;

    Error.captureStackTrace(this);
  }
}

export default HttpException;
