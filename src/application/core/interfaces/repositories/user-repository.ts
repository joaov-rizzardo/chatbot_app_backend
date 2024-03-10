import { CreateUserDTO } from '../../dtos/user/create-user-dto';
import { User } from '../../entities/user';

export abstract class UserRepository {
  abstract create({}: CreateUserDTO): Promise<User>;
  abstract findById(userId: string): Promise<User | null> | User | null;
  abstract findByEmail(email: string): Promise<User> | null;
  abstract checkIfUserExistsByEmail(email: string): Promise<boolean>;
  abstract checkIfUserExistsById(userId: string): Promise<boolean>;
}
