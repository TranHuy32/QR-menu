import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

const route = Router();

module.exports = (app) => {
  app.use('/test', route);

  route.get('/', async (req, res) => {
    console.log('test');
    res.json('test').status(StatusCodes.OK)
  });
};
