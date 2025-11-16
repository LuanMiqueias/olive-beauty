import { Request, Response } from 'express';
import { UserRepository } from '../repositories/UserRepository';
import { RegisterUserUseCase } from '../use-cases/RegisterUserUseCase';
import { LoginUserUseCase } from '../use-cases/LoginUserUseCase';
import { GetCurrentUserUseCase } from '../use-cases/GetCurrentUserUseCase';
import { registerSchema } from '../dtos/RegisterDTO';
import { loginSchema } from '../dtos/LoginDTO';
import { AppError } from '../../../shared/errors/AppError';

const userRepository = new UserRepository();
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository);
const getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const user = await registerUserUseCase.execute(validatedData);

      return res.status(201).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }

      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({
          status: 'error',
          message: 'Dados inválidos',
          errors: error,
        });
      }

      throw error;
    }
  }

  async login(req: Request, res: Response) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await loginUserUseCase.execute(validatedData);

      return res.json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }

      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({
          status: 'error',
          message: 'Dados inválidos',
          errors: error,
        });
      }

      throw error;
    }
  }

  async me(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Não autenticado',
        });
      }

      const user = await getCurrentUserUseCase.execute(userId);

      return res.json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }

      throw error;
    }
  }
}

