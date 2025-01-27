import { inject, injectable } from 'tsyringe';

import { Users } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

interface IRequest {
  name?: string;
  email?: string;
  password?: string;
  language?: string;
  phone?: string;
  image?: Buffer;
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
      const userWithUpdatedEmail = await this.usersRepository.findByEmailWithRelations(updateData.email.toLowerCase());
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

    if(!data.pedigree) {
      const s3 = new S3Client({
        region: bucketRegion,
        credentials: {
          accessKeyId: accessKey as string,
          secretAccessKey: secretAccessKey as string
        }
      });

      if (data.image && s3) {
        
        const buffer = await sharp(data.image).resize({height: 300, width: 300, fit: 'contain'}).png().toBuffer();

        const params = {
          Bucket: bucketName,
          Key: `${id}.png`,
          Body: buffer,
          ContentType: 'image/png',
        };

        try {
          await s3.send(new PutObjectCommand(params));
          data.image = `${id}.png`;
        } catch (error: any) {
          throw new AppError('Error uploading image to S3');
        }
      }
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
