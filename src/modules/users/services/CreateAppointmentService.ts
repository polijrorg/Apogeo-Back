import { inject, injectable } from 'tsyringe';
import sgMail from '@sendgrid/mail';

import { Users } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import moment from 'moment-timezone';

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

    const formattedDate = moment().tz("America/Sao_Paulo").format('DD/MM/YYYY');
    const formattedTime = moment().tz("America/Sao_Paulo").format('HH:mm');
    const formattedBirthdate = moment(user.birthdate, 'DD/MM/YYYY').locale('pt-br').format('DD/MM/YYYY');

    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

    const msg = {
      to: "dr.joaosiufi@gmail.com",
      from: 'dr.joaosiufi@gmail.com',
      subject: 'Apogeo | Solicitação de consulta médica',
      text: `João, o usuário ${user.name} solicitou uma consulta médica. <br><br>Pedido realizado em <strong>${formattedDate}</strong> às <strong>${formattedTime}</strong>.<br><br><strong>Informações do usuário</strong><br>Nome: ${user.name}<br>Email: ${user.email}<br>Telefone: ${user.phone}<br>Idioma: ${user.language}<br>${user.gender != null ? "Gênero: "+ user.gender + "<br>": ""}${user.birthdate ? "Data de Nascimento: " + formattedBirthdate + "<br>" : ""}`,
      html: `João, o usuário ${user.name} solicitou uma consulta médica. <br><br>Pedido realizado em <strong>${formattedDate}</strong> às <strong>${formattedTime}</strong>.<br><br><strong>Informações do usuário</strong><br>Nome: ${user.name}<br>Email: ${user.email}<br>Telefone: ${user.phone}<br>Idioma: ${user.language}<br>${user.gender != null ? "Gênero: "+ user.gender + "<br>": ""}${user.birthdate ? "Data de Nascimento: " + formattedBirthdate + "<br>" : ""}`,
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
