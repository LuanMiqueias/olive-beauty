import { UserRepository } from '../repositories/UserRepository';
import { AppError } from '../../../shared/errors/AppError';

export class GetCurrentUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}

