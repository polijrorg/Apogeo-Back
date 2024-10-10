import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/users/services/CreateAppointmentService';

export default class AppointmentsController {

  public async create(req: Request, res: Response): Promise<Response> {
    const { id } = req.token;

    const readUser = container.resolve(CreateAppointmentService);

    const user = await readUser.execute({
      id,
    });

    return res.status(201).json({
      ...user,
      password: undefined,
      pin: undefined,
      pinExpires: undefined,
      pedigree: undefined,
    });
  }
}
