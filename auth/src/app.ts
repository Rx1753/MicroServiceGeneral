import express from 'express';
import 'express-async-errors';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@rx-projects/common';
import { adminAuthRouter } from './routes/admin-router';
import { customerRouter } from './routes/customer-router';
import { countryRouter } from './routes/country-router';
import { stateRouter } from './routes/state-router';
import { cityRouter } from './routes/city-router';

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

//Router
app.use(adminAuthRouter);
app.use(customerRouter);
app.use(countryRouter);
app.use(stateRouter);
app.use(cityRouter);

app.all('*', async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
