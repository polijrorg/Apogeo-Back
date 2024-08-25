import { inject, injectable } from 'tsyringe';
import sgMail from '@sendgrid/mail';

import { Users } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  email: string;
}

@injectable()
export default class SendPinToUserEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }

  public async execute({
    email,
  }: IRequest): Promise<Users> {
    const userAlreadyExists = await this.usersRepository.findByEmailWithRelations(email);
    if (!userAlreadyExists) throw new AppError('User with this email does not exist');

    const expiration = 15;
    const pin = Math.floor(Math.random() * 9999).toString();
    const data = new Date();
    data.setMinutes(data.getMinutes() + expiration);
    const user = await this.usersRepository.sendPinToUserEmail(
      email.toLowerCase(),
      pin,
      data,
    );

    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
    const msg = {
      to: email,
      from: 'tassyla.lima@polijunior.com.br',
      subject: 'Apogeo | Recuperação de senha',
      text: `${user.name}, seu pin para recuperação de senha é: ${pin}. O processo de recuperação expira em ${expiration} minutos.`,
      html: `${user.name}, seu pin para recuperação de senha é: <strong>${pin}</strong>. O processo de recuperação expira em ${expiration} minutos.`,
    };

    try {
      await sgMail.send(msg);
      console.log('Email sent');
    } catch (error: any) {
      console.error(error);
    }

    return user;
  }
}
