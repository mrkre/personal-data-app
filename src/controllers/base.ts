import { Response, Router } from 'express';
import httpStatus from 'http-status';

interface Controller {
  path: string;
  router: Router;
  initRoutes(): void;
}

abstract class BaseController implements Controller {
  public path: string;
  public router: Router;

  constructor() {
    this.initRoutes();
  }

  public abstract initRoutes(): void;

  private static jsonResponse(res: Response, code: number, message: string) {
    return res.status(code).json({ message });
  }

  public ok<T>(res: Response, dto?: T) {
    if (!!dto) {
      return res.status(httpStatus.OK).json(dto);
    }
    return res.sendStatus(httpStatus.OK);
  }

  public created(res: Response) {
    return res.sendStatus(httpStatus.CREATED);
  }

  public badRequest(res: Response, message?: string) {
    return BaseController.jsonResponse(res, httpStatus.BAD_REQUEST, message || 'Bad Request');
  }

  public unauthorized(res: Response, message?: string) {
    return BaseController.jsonResponse(res, httpStatus.UNAUTHORIZED, message || 'Unauthorized');
  }

  public forbidden(res: Response, message?: string) {
    return BaseController.jsonResponse(res, httpStatus.FORBIDDEN, message || 'Forbidden');
  }

  public fail(res: Response, error: Error | string) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.toString() });
  }
}

export default BaseController;
