import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import passportJwt from 'passport-jwt';
import { UnauthorizedException } from '../exceptions';
import UserService from '../services/user';
import { JWT_SECRET_OR_KEY } from '../util/secrets';

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const userService = new UserService();

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET_OR_KEY,
    },
    function (token, done) {
      return userService
        .findOneById(token.userId)
        .then((user) => {
          if (!user.active || !user) {
            return done(new UnauthorizedException());
          }
          return done(undefined, user, token);
        })
        .catch((err) => {
          return done(err, false);
        });
    },
  ),
);

/*
 * @method authenticate
 * @desc authentication middleware
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) =>
  passport.authenticate('jwt', { session: false }, function (err, user) {
    if (err) return next(err);

    if (!user) {
      return next(new UnauthorizedException());
    }
    req.user = user;
    next();
  })(req, res, next);
