import { Router } from 'express';
import userRoutes from './user'
import tableRouter from './table';
import categoryRouter from './category';
import dishRoute from './dish';
import refreshTokenRoutes from './auth'

// any endpoints for api/{anything} will be here
const v1 = Router();

// test(v1);
userRoutes(v1);
tableRouter(v1);
categoryRouter(v1);
dishRoute(v1);
refreshTokenRoutes(v1)


module.exports = v1;
