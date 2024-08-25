import ensureAuthenticated from '@shared/infra/http/middlewares/EnsureAuthenticated';
import { Router } from 'express';

import PedigreesController from '../controller/PedigreesController';

const pedigreesRoutes = Router();

const pedigreesController = new PedigreesController();

pedigreesRoutes.patch('/save', ensureAuthenticated, pedigreesController.save);
pedigreesRoutes.get('/read', ensureAuthenticated, pedigreesController.read);

export default pedigreesRoutes;
