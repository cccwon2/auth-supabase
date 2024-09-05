import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('auth') // This decorator is crucial for grouping the endpoints under "auth"
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(
      createUserDto.email,
      createUserDto.password,
      createUserDto.fullName,
    );
  }

  @Post('login')
  @ApiOperation({ summary: '로그인' })
  @ApiOkResponse({
    description: '로그인 성공 시 회원 프로필 정보 반환',
    type: UserProfileDto, // 응답으로 반환할 DTO
  })
  @ApiResponse({ status: 401, description: '잘못된 자격 증명' })
  async login(@Body() loginUserDto: LoginUserDto): Promise<UserProfileDto> {
    return this.authService.login(loginUserDto.email, loginUserDto.password);
  }
}
