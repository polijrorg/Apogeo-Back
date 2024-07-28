import { inject, injectable } from 'tsyringe';

import { Users } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  id: string;
  pin: string;
  password: string;
}

@injectable()
export default class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) { }

public async execute({
  id,
  pin,
  password,
}: IRequest): Promise<Users> {
    const userAlreadyExists = await this.usersRepository.findById(id);

    if (!userAlreadyExists) throw new AppError('User with this id does not exist');
    
    if (userAlreadyExists?.pinExpires && userAlreadyExists.pin != pin) throw new AppError('Pin is incorrect');
    if (userAlreadyExists?.pinExpires && userAlreadyExists.pinExpires < new Date()) throw new AppError('Pin is expired');

    const hashedPassword = await this.hashProvider.generateHash(password);
    const updatedUser = await this.usersRepository.resetPassword(id, hashedPassword);

    return updatedUser;
  }
}
