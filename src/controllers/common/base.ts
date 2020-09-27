import { Request, Response, NextFunction, Router } from 'express';
import httpStatus from 'http-status';
import { validationResult, ValidationError, ValidationChain } from 'express-validator';

interface Controller {
  path: string;
  router: Router;
  initRoutes(): void;
}

abstract class BaseController implements Controller {
  public path: string;
  public router: Router;

  protected constructor(path: string) {
    this.path = path;
    this.router = Router();
  }

  abstract initRoutes(): void;

  public validate = (validations: Array<ValidationChain>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      await Promise.all(validations.map((validation) => validation.run(req)));

      const errors = validationResult(req);

      if (errors.isEmpty()) {
        return next();
      }

      return this.badRequest(res, 'Validation error', errors.array());
    };
  };

  private static jsonResponse(res: Response, code: number, message: string, errors?: Array<string | ValidationError>) {
    return res.status(code).json({ message, errors });
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

  public badRequest(res: Response, message?: string, errors?: Array<string | ValidationError>) {
    return BaseController.jsonResponse(res, httpStatus.BAD_REQUEST, message || 'Bad Request', errors);
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
