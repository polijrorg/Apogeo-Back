import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ReadUserByIdService from '@modules/users/services/ReadUserByIdService';
import UpdateUserService from '@modules/users/services/UpdateUserService';

export default class PedigreeController {

  public async read(req: Request, res: Response): Promise<Response> {
    const { id } = req.token;

    const readUser = container.resolve(ReadUserByIdService);

    const user = await readUser.execute({
      id,
    });

    return res.status(201).json(user.pedigree);
  }

  public async save(req: Request, res: Response): Promise<Response> {
    const { id } = req.token;

    const updateUser = container.resolve(UpdateUserService);

    const user = await updateUser.execute(
      id,
      {
        pedigree: req.body,
      },
    );

    return res.status(201).json(user.pedigree);
  }
}
