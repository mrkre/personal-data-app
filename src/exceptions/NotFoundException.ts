import httpStatus from 'http-status';
import HttpException from './HttpException';

class NotFoundException extends HttpException {
  constructor(message: string) {
    super(httpStatus.NOT_FOUND, message);
  }
}

export default NotFoundException;
