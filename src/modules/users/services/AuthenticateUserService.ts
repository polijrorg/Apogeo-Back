import { inject, injectable } from 'tsyringe';
import { sign } from 'jsonwebtoken';

import { Users } from '@prisma/client';

import AppError from '@shared/errors/AppError';
import authConfig from '@config/auth';

import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

@injectable()
export default class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) { }

  public async execute({ email, password, rememberMe }: IRequest): Promise<{ user: Users, token: string }> {
    const user = await this.usersRepository.findByEmailWithRelations(email.toLocaleLowerCase());

    if (!user) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const { secret, expiresInShort, expiresInNever } = authConfig.jwt;
    const expiresIn = rememberMe ? expiresInNever : expiresInShort;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    };
  }
}
