import { Router } from 'express';
import ensureAuthenticated from '@shared/infra/http/middlewares/EnsureAuthenticated';
import AppointmentsController from '../controller/AppointmentsController';

const appointmentsRouter = Router();

const appointmentsController = new AppointmentsController();

appointmentsRouter.post('/register', ensureAuthenticated, appointmentsController.create);

export default appointmentsRouter;
