import passport from 'passport';
import passportJwt from 'passport-jwt';
import { UnauthorizedException } from '../exceptions';
import UserService from '../services/user';
import { JWT_SECRET_OR_KEY } from '../util/secrets';
import messages from '../messages/auth';

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
      userService
        .findOneByEmail(token.email)
        .then((user) => {
          if (!!user.active || !!user) {
            return done(new UnauthorizedException(messages.INVALID_EMAIL_OR_PASSWORD), false);
          }
          return done(undefined, user, token);
        })
        .catch((err) => {
          return done(err, false);
        });
    },
  ),
);
