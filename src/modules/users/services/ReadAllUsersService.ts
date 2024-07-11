import { inject, injectable } from 'tsyringe';

import { Users } from '@prisma/client';

import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
export default class ReadAllUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }

  public async execute(): Promise<Users[] | null> {

    const users = this.usersRepository.findAll();

    return users;
  }
}
