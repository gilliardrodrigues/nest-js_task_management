import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/auth/jwt.payload.interface';
import { UserErrors } from 'src/users/errors/user-errors.enum';
import { UsersRepository } from '../users/repository/users.repository';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    const result = await this.usersRepository.createUser(authCredentialsDTO);

    if (result === UserErrors.USERNAME_ALREADY_EXISTS) {
      throw new ConflictException('Username already exists!');
    }

    if (result === UserErrors.UNKNOWN_ERROR) {
      throw new InternalServerErrorException();
    }
  }

  async signIn(authCredentialsDTO: AuthCredentialsDTO): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDTO;
    const user = await this.usersRepository.findByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials!');
    }
  }
}
