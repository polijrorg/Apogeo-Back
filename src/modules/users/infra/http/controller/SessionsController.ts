import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import generateUserImageUrl from '@shared/infra/http/middlewares/GenerateUserImageUrl';

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
      image: user ? await generateUserImageUrl(user) : null,
    });

    return res.json({ ommitedUser, token });
  }
}
