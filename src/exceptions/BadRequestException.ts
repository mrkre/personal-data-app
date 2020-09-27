import httpStatus from 'http-status';
import HttpException from './HttpException';

class BadRequestException extends HttpException {
  constructor(message: string, errors?: Array<string>) {
    super(httpStatus.BAD_REQUEST, message, errors);
  }
}

export default BadRequestException;
