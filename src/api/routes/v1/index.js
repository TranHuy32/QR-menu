import { Router } from 'express';
import userRoutes from './user'


// any endpoints for api/{anything} will be here
const v1 = Router();
// test(v1);
userRoutes(v1);
module.exports = v1;
