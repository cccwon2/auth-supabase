import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'cccwon2@kakao.com' })
  email: string;

  @ApiProperty({ example: 'password123' })
  password: string;
}
