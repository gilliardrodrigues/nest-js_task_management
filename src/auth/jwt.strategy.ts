import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../auth/jwt.payload.interface';
import { UsersRepository } from '../users/repository/users.repository';
import { User } from '../users/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersRepository: UsersRepository,
    configService: ConfigService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not defined!');
    }

    super({
      secretOrKey: jwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;
    const user = await this.usersRepository.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
