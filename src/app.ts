import express from 'express';
import compression from 'compression';
import session from 'express-session';
import bodyParser from 'body-parser';
import lusca from 'lusca';
import cors from 'cors';
import mongo from 'connect-mongo';
import path from 'path';
import mongoose from 'mongoose';
import bluebird from 'bluebird';
import passport from 'passport';
import { MONGO_URL, SESSION_SECRET } from './util/secrets';
import routes from './routes';
import { handleNotFound, handleError } from './middleware/error';

const MongoStore = mongo(session);

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGO_URL;
mongoose.Promise = bluebird;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
  })
  .catch((err) => {
    console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
    // process.exit();
  });

// Express configuration
app.set('port', process.env.PORT || 8000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
      url: mongoUrl,
      autoReconnect: true,
    }),
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

const options: cors.CorsOptions = {
  // enable localhost in dev
  ...(process.env.ENABLE_LOCALHOST_CORS && {
    origin: (origin, callback) => {
      callback(null, true);
    },
  }),
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token', 'Authorization'],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
};

app.use(cors(options));
app.options('*', cors(options));

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

/**
 * API routes.
 */
app.use('/', routes());

// error middleware
app.use(handleNotFound);
app.use(handleError);

export default app;
