import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/UserRepository';
import { LoginDTO } from '../dtos/LoginDTO';
import { AppError } from '../../../shared/errors/AppError';
import { generateToken } from '../../../shared/utils/jwt';

export class LoginUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: LoginDTO) {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new AppError('Email ou senha inválidos', 401);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Email ou senha inválidos', 401);
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }
}

