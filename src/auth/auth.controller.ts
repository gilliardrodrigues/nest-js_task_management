import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { AuthCredentialsDTO } from 'src/auth/dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    return this.authService.signUp(authCredentialsDTO);
  }

  @Post('/signin')
  signIn(@Body() authCredentialsDTO: AuthCredentialsDTO): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDTO);
  }
}
