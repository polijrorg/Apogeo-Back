import { inject, injectable } from 'tsyringe';

import { Users } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  id: string;
}

@injectable()
export default class DeleteUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) { }

  public async execute({ id }: IRequest): Promise<Users> {
    const userAlreadyExists = await this.usersRepository.findById(id);

    if (!userAlreadyExists) throw new AppError('User with this id does not exist');

    const deletedUser = this.usersRepository.delete(id);

    return deletedUser;
  }
}
