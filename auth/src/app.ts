import express from 'express';
import 'express-async-errors';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';

const app = express();

// The reason for this that traffic is being proxy to our app through ingress nginx
app.set('trust proxy', true);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    signed: false, // Disable encryption in cookie
    secure: true, // use cookie only on https connection
  })
);

export { app };
