import passport from 'passport';
import passportLocal from 'passport-local';
import User from '../models/User';

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));
