import { Router } from 'express';

import UsersController from '../controller/UsersController';

const usersRoutes = Router();

const usersController = new UsersController();

usersRoutes.post('/register', usersController.create);
usersRoutes.patch('/update/:id', usersController.update);
usersRoutes.delete('/delete/:id', usersController.delete);
usersRoutes.get('/read', usersController.readAll);
usersRoutes.get('/read/:id', usersController.readById);
usersRoutes.post('/send-pin', usersController.sendPin);
usersRoutes.post('/verify-pin/:id', usersController.verifyPin);
usersRoutes.post('/reset-password/:id', usersController.resetPassword);


export default usersRoutes;
