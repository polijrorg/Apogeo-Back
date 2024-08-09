import auth from '@config/auth';
import { NextFunction, Request, Response } from 'express';
import { Secret, verify } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';

interface ITokenPayload {
  iss: string;
  sub: string;
  exp: number;
  iat: number;
}

export default function ensureAuthenticated(request: Request, _response: Response, next: NextFunction): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) { throw new AppError('Token não enviado'); }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verify(token, auth.jwt.secret as Secret);

    const { sub: id } = decoded as ITokenPayload;
    request.token = { id };

    return next();
  } catch (error) {
    throw new AppError('Token inválido');
  }
}
