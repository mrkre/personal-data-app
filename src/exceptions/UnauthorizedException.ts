import httpStatus from 'http-status';
import HttpException from './HttpException';

class UnauthorizedException extends HttpException {
  constructor(message: string, errors?: Array<string>) {
    super(httpStatus.UNAUTHORIZED, message, errors);
  }
}

export default UnauthorizedException;
