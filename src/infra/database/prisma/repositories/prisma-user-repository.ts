import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/application/core/interfaces/repositories/user-repository';
import { PrismaProvider } from '../prisma-provider';
import { CreateUserDTO } from 'src/application/core/dtos/create-user-dto';
import { User } from 'src/application/core/entities/user';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  async create({
    name,
    email,
    lastName,
    password,
  }: CreateUserDTO): Promise<User> {
    const createdUser = await this.prisma.users.create({
      data: {
        name,
        last_name: lastName,
        email,
        password,
      },
    });
    return new User({
      id: createdUser.id,
      name: createdUser.name,
      lastName: createdUser.last_name,
      email: createdUser.email,
      password: createdUser.password,
      profilePicture: createdUser.profile_picture,
      createdAt: createdUser.created_at,
      updatedAt: createdUser.updated_at,
    });
  }

  async checkUserExistsByEmail(email: string): Promise<boolean> {
    const quantity = await this.prisma.users.count({ where: { email } });
    return quantity > 0;
  }
}
