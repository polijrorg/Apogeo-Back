import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      email,
      password,
      rememberMe,
    } = req.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const { user, token } = await authenticateUser.execute({ email, password, rememberMe });

    const ommitedUser = ({
      ...user,
      password: undefined,
      pin: undefined,
      pinExpires: undefined,
      pedigree: undefined,
    });

    return res.json({ ommitedUser, token });
  }
}
