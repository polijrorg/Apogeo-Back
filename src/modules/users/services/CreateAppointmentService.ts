import { inject, injectable } from 'tsyringe';
import sgMail from '@sendgrid/mail';

import { Users } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  id: string;
}

@injectable()
export default class CreateAppointmentService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }

  public async execute({
    id
  }: IRequest): Promise<Users> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new AppError('This user does not exist');

    const date = new Date();

    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
    const formatDate = (date: number) => date.toString().padStart(2, '0');

    const msg = {
      to: "tatitassyla@gmail.com",
      from: 'tassyla.lima@polijunior.com.br',
      subject: 'Apogeo | Solicitação de consulta médica',
      text: `João, o usuário ${user.name} solicitou uma consulta médica. <br><br>Pedido realizado em <strong>${formatDate(date.getDate())}/${formatDate(date.getMonth()+1)}/${date.getFullYear()}</strong> às <strong>${formatDate(date.getHours())}:${formatDate(date.getMinutes())}</strong>.<br><br><strong>Informações do usuário</strong><br>Email: ${user.email}<br>Telefone: ${user.phone}<br>Idioma: ${user.language}<br>${user.gender != null ? "Gênero: "+ user.gender + "<br>": ""}${user.birthdate ? "Data de Nascimento: " + user.birthdate + "<br>" : ""}`,
      html: `João, o usuário ${user.name} solicitou uma consulta médica. <br><br>Pedido realizado em <strong>${formatDate(date.getDate())}/${formatDate(date.getMonth()+1)}/${date.getFullYear()}</strong> às <strong>${formatDate(date.getHours())}:${formatDate(date.getMinutes())}</strong>.<br><br><strong>Informações do usuário</strong><br>Email: ${user.email}<br>Telefone: ${user.phone}<br>Idioma: ${user.language}<br>${user.gender != null ? "Gênero: "+ user.gender + "<br>": ""}${user.birthdate ? "Data de Nascimento: " + user.birthdate + "<br>" : ""}`,
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
