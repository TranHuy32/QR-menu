import { Router } from 'express';
import test from './test';

// any endpoints for api/{anything} will be here
const v1 = Router();
test(v1);

module.exports = v1;
