import { Router } from 'express';

import usersRoutes from '@modules/users/infra/http/routes/users.routes';
import sessionsRoutes from '@modules/users/infra/http/routes/sessions.routes';
import pedigreesRoutes from '@modules/users/infra/http/routes/pedigrees.routes';
import appointmentsRouter from '@modules/users/infra/http/routes/appointments.routes';

const routes = Router();

routes.use('/user', usersRoutes);
routes.use('/sessions', sessionsRoutes);
routes.use('/pedigree', pedigreesRoutes);
routes.use('/appointments', appointmentsRouter);

export default routes;
