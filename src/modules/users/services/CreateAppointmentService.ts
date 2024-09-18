import { inject, injectable } from 'tsyringe';
import sgMail from '@sendgrid/mail';

import { Users } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  id: string;
  date: Date;
}

@injectable()
export default class CreateAppointmentService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }

  public async execute({
    id, date
  }: IRequest): Promise<Users> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new AppError('This user does not exist');

    date = new Date(date);

    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
    const msg = {
      to: "lucas.aguiar@polijunior.com.br",
      from: 'tassyla.lima@polijunior.com.br',
      subject: 'Apogeo | Solicitação de consulta médica',
      text: `João, o usuário ${user.name} solicitou uma consulta médica no dia ${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} às ${date.getHours()}:${date.getMinutes()}.<br><br><strong>Dados do paciente</strong><br>Nome: ${user.name}<br>Telefone: ${user.phone}<br>Email: ${user.email}<br><br><strong>Data proposta</strong><br>Data: ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}<br>Horário: ${date.getHours()}:${date.getMinutes()}`,
      html: `João, o usuário ${user.name} solicitou uma consulta médica no dia ${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} às ${date.getHours()}:${date.getMinutes()}.<br><br><strong>Dados do paciente</strong><br>Nome: ${user.name}<br>Telefone: ${user.phone}<br>Email: ${user.email}<br><br><strong>Data proposta</strong><br>Data: ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}<br>Horário: ${date.getHours()}:${date.getMinutes()}`,
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
