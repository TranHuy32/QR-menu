import { Router } from 'express';
import userRoutes from './user';
import tableRoutes from './table';
import categoryRoutes from './category';
import dishRoutes from './dish';
import refreshTokenRoutes from './auth';
import imageRoute from './image';
import orderRoutes from './order';
import employeeRoutes from './employee';
import optionRoutes from './option';
import billRoutes from './bill';
import evaluateRoutes from './evaluate';
import chatBotRoutes from './chatBotClient';
import zaloPayRoutes from './zalopay';

// any endpoints for api/{anything} will be here
const v1 = Router();

// test(v1);
userRoutes(v1);
tableRoutes(v1);
categoryRoutes(v1);
dishRoutes(v1);
refreshTokenRoutes(v1);
imageRoute(v1);
orderRoutes(v1);
employeeRoutes(v1);
optionRoutes(v1);
billRoutes(v1);
evaluateRoutes(v1);
chatBotRoutes(v1);
zaloPayRoutes(v1);
module.exports = v1;
