import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/UserRepository';
import { RegisterDTO } from '../dtos/RegisterDTO';
import { AppError } from '../../../shared/errors/AppError';

export class RegisterUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: RegisterDTO) {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError('Email já está em uso', 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: 'USER',
    });

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}

