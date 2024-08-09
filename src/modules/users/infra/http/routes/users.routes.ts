import ensureAuthenticated from '@shared/infra/http/middlewares/EnsureAuthenticated';
import { Router } from 'express';

import UsersController from '../controller/UsersController';

const usersRoutes = Router();

const usersController = new UsersController();

usersRoutes.post('/register', usersController.create);
usersRoutes.patch('/update', ensureAuthenticated, usersController.update);
usersRoutes.delete('/delete', ensureAuthenticated, usersController.delete);
usersRoutes.get('/readAll', usersController.readAll);
usersRoutes.get('/read', ensureAuthenticated, usersController.readById);
usersRoutes.post('/send-pin', usersController.sendPin);
usersRoutes.post('/verify-pin/:id', usersController.verifyPin);
usersRoutes.post('/reset-password/:id', usersController.resetPassword);


export default usersRoutes;
