import { inject, injectable } from 'tsyringe';
import { Users } from '@prisma/client';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  id: string;
  pin: string;
}

@injectable()
export default class VerifyPinService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }

  public async execute({
    id, pin,
  }: IRequest): Promise<Users> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new AppError('User with this id does not exist');
    if (user?.pinExpires && user.pin != pin) throw new AppError('Pin is incorrect');
    if (user?.pinExpires && user.pinExpires < new Date()) throw new AppError('Pin is expired');

    return user;
  }
}
