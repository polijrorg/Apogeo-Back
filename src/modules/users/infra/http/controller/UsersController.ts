import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';
import DeleteUserService from '@modules/users/services/DeleteUserService';
import ReadAllUsersService from '@modules/users/services/ReadAllUsersService';
import ReadUserByIdService from '@modules/users/services/ReadUserByIdService';
import UpdateUserService from '@modules/users/services/UpdateUserService';
import SendPinToUserEmailService from '@modules/users/services/SendPinToUserEmailService';
import VerifyPinService from '@modules/users/services/VerifyPinService';
import resetPasswordService from '@modules/users/services/resetPasswordService';

export default class UserController {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      name,
      email,
      password,
      language,
      phone,
    } = req.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      password,
      language,
      phone,
    });

    user.password = '###';

    return res.status(201).json(user);
  }

  public async readAll(req: Request, res: Response): Promise<Response> {

    const readUsers = container.resolve(ReadAllUsersService);

    const users = await readUsers.execute();

    if(users) {
        users.forEach(user => {
        user.password = '###';
      });
    }
    
    return res.status(201).json(users);
  }

  public async readById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const readUser = container.resolve(ReadUserByIdService);

    const user = await readUser.execute({
      id,
    });

    if(user){
      user.password = '###';
    }

    return res.status(201).json(user);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const {
      name,
      email,
      password,
      language,
      phone,
    } = req.body;

    const updateUser = container.resolve(UpdateUserService);

    const user = await updateUser.execute({
      id,
      name,
      email,
      password,
      language,
      phone,
    });

    user.password = '###';

    return res.status(201).json(user);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const deleteUser = container.resolve(DeleteUserService);

    const user = await deleteUser.execute({
      id,
    });

    user.password = '###';

    return res.status(201).json(user);
  }

  public async sendPin(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    const sendPinToUserEmail = container.resolve(SendPinToUserEmailService);

    const user = await sendPinToUserEmail.execute({
      email,
    });

    return res.status(201).json({id: user.id});
  }

  public async verifyPin(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { pin } = req.body;

    const verifyPin = container.resolve(VerifyPinService);

    const user = await verifyPin.execute({
      id,
      pin,
    });

    return res.status(201).json({id: user.id});
  }

  public async resetPassword(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { password } = req.body;

    const resetPassword = container.resolve(resetPasswordService);

    const user = await resetPassword.execute({id, password});

    return res.status(201).json({id: user.id});
  }

}
