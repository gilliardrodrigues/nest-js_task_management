import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserErrors } from 'src/users/errors/user-errors.enum';
import { User } from 'src/users/user.entity';
import { DataSource, Repository } from 'typeorm';
import { AuthCredentialsDTO } from '../../auth/dto/auth-credentials.dto';

@Injectable()
export class UsersRepository {
  private readonly repository: Repository<User>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(User);
  }

  async createUser(authCredentialsDTO: AuthCredentialsDTO): Promise<UserErrors | void> {
    const { username, password } = authCredentialsDTO;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.repository.create({ username, password: hashedPassword });

    try {
      await this.repository.save(user);
    } catch (error) {
      return error.code === '23505' ? UserErrors.USERNAME_ALREADY_EXISTS : UserErrors.UNKNOWN_ERROR;
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    const userFound = await this.repository.findOneBy({ username });

    return userFound;
  }
}
