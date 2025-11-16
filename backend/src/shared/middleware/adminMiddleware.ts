import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'Não autenticado',
    });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      status: 'error',
      message: 'Acesso negado. Apenas administradores.',
    });
  }

  next();
};

