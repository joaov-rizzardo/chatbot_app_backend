import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from '../../core/dtos/create-user-dto';
import { UserRepository } from '../../core/interfaces/repositories/user-repository';
import { Either, left, right } from 'src/application/errors/either';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { User } from 'src/application/core/entities/user';

type CreateUserUseCaseResponse = Either<UserAlreadyExistsError, User>;
@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}
  async execute({
    name,
    lastName,
    email,
    password,
  }: CreateUserDTO): Promise<CreateUserUseCaseResponse> {
    if (await this.userRepository.checkUserExistsByEmail(email)) {
      return left(new UserAlreadyExistsError(email));
    }
    const user = await this.userRepository.create({
      name,
      email,
      lastName,
      password,
    });
    return right(user);
  }
}
