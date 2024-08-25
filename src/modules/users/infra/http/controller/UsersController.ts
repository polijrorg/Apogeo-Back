import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';
import DeleteUserService from '@modules/users/services/DeleteUserService';
import ReadAllUsersService from '@modules/users/services/ReadAllUsersService';
import ReadUserByIdService from '@modules/users/services/ReadUserByIdService';
import UpdateUserService from '@modules/users/services/UpdateUserService';
import SendPinToUserEmailService from '@modules/users/services/SendPinToUserEmailService';
import VerifyPinService from '@modules/users/services/VerifyPinService';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';

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

    return res.status(201).json({
      ...user,
      password: undefined,
      pin: undefined,
      pinExpires: undefined,
    });
  }

  public async readAll(req: Request, res: Response): Promise<Response> {

    const readUsers = container.resolve(ReadAllUsersService);

    const users = await readUsers.execute();
    
    return res.status(201).json(users?.map(user => {
      return {
        ...user,
        password: undefined,
        pin: undefined,
        pinExpires: undefined,
      };
    }));
  }

  public async readById(req: Request, res: Response): Promise<Response> {
    const { id } = req.token;
    
    const readUser = container.resolve(ReadUserByIdService);

    const user = await readUser.execute({
      id,
    });

    return res.status(201).json({
      ...user,
      password: undefined,
      pin: undefined,
      pinExpires: undefined,
    });
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.token;

    const {
      name,
      email,
      password,
      language,
      phone,
      image,
      gender,
      birthdate,
    } = req.body;

    const updateUser = container.resolve(UpdateUserService);

    const user = await updateUser.execute(
      id,
      { name,
      email,
      password,
      language,
      phone,
      image,
      gender,
      birthdate, }
    );

    return res.status(201).json({
      ...user,
      password: undefined,
      pin: undefined,
      pinExpires: undefined,
    });
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.token;

    const deleteUser = container.resolve(DeleteUserService);

    const user = await deleteUser.execute({
      id,
    });

    return res.status(201).json({
      ...user,
      password: undefined,
      pin: undefined,
      pinExpires: undefined,
    });
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
    const { pin, password } = req.body;

    const resetPassword = container.resolve(ResetPasswordService);

    const user = await resetPassword.execute({id, pin, password});

    return res.status(201).json({id: user.id});
  }

}
