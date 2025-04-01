/**
 * Setup express server.
 */
import morgan from 'morgan';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import cors from "cors"
import helmet from 'helmet';
import { NodeEnvs } from './constants/misc';
import { errorHandler } from './core';
import AuthRouter from "./routes/authRoutes"
import ProductRouter from "./routes/productRoutes"
import dotenv from "dotenv"

dotenv.config();
const app = express();


// **** Setup **** //
app.use(cors());
app.use(helmet());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', "true");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Show routes called in console during development
if (process.env.NODE_ENV === NodeEnvs.Dev.valueOf()) {
  app.use(morgan("dev"));
}

// Security
if (process.env.NODE_ENV === NodeEnvs.Production.valueOf()) {
  app.use(helmet());
}

app.all('/', (req, res) => {
  res
    .status(200)
    .setHeader('Content-Type', 'application/json')
    .json({
      success: true,
      status: 'success',
      message: `Welcome to ${process.env.NAME} Backend`,
      version: '0.0.1',
      developer: 'https://github.com/mainstack-assessment',
      health: "Changes Reflected test Completely Set Up!, 100% We're Ready",
      server_time: `${new Date()}`,
      data: { ...req.body, ...req.query }
    });
});



// Simple ping endpoint to wake server up
app.get('/v1/ping', (req: Request, res: Response) => {
  res.status(200).send('Server is awake!');
});
// Add API's after middleware
app.use('/v1/auth', AuthRouter);
app.use("/v1/product", ProductRouter);

// catch 404 routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    status: 'Resource Not Found',
    error: '404 Content Do Not Exist Or Has Been Deleted'
  });
});

app.use(errorHandler);

process.on('uncaughtException', (err) => {
  console.error(err);
  console.log('Node NOT Exiting...'); // Override Grace full exist [EXPERIMENTAL]
});


module.exports = app;


export default app
