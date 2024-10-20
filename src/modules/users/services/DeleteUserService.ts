import { inject, injectable } from 'tsyringe';

import { Users } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

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

    if (userAlreadyExists.image) {
      const s3 = new S3Client({
        region: bucketRegion,
        credentials: {
          accessKeyId: accessKey as string,
          secretAccessKey: secretAccessKey as string
        }
      });

      const getObjectParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: userAlreadyExists.image,
      }

      const command = await new DeleteObjectCommand(getObjectParams);
      await s3.send(command);
    }
    
    const deletedUser = this.usersRepository.delete(id);

    return deletedUser;
  }
}
