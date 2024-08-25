import { inject, injectable } from 'tsyringe';

import { Users } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  name?: string;
  email?: string;
  password?: string;
  language?: string;
  phone?: string;
  image?: string;
  gender?: string;
  birthdate?: Date;
  pedigree?: JSON;
}

@injectable()
export default class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) { }

  public async execute(id: string, updateData: IRequest): Promise<Users> {
    const userAlreadyExists = await this.usersRepository.findById(id);

    if (!userAlreadyExists) throw new AppError('User with this id does not exist');
    if (updateData.email) {
      const userWithUpdatedEmail = await this.usersRepository.findByEmailWithRelations(updateData.email);
      if (userWithUpdatedEmail) {
        if (userWithUpdatedEmail.id == id) {
          throw new AppError('You cannot update your email to the same email');
        }
        if (userWithUpdatedEmail.id !== id) {
          throw new AppError('User with same email already exists');
        }
      }
    }
    if (updateData.birthdate || updateData.birthdate == '') {
      const birthdate = new Date(updateData.birthdate);
      if (isNaN(birthdate.getTime())) {
        throw new AppError('Birthdate is not a valid date');
      }

      if (birthdate > new Date()) {
        throw new AppError('Birthdate cannot be greater than current date');
      }
    }

    const data = { ...userAlreadyExists, ...updateData };

    let hashedPassword;
    if (data.password) {
      hashedPassword = await this.hashProvider.generateHash(data.password.toString());
    } else {
      hashedPassword = data.password;
    }

    const updatedUser = this.usersRepository.update(
      id,
      {
        ...data,
        email: data.email?.toLowerCase(),
        password: hashedPassword,
      },
    );

    return updatedUser;
  }
}
