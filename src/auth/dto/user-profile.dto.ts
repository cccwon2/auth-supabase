import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({
    example: 1,
    description: '사용자의 고유 ID',
  })
  id: number;

  @ApiProperty({
    example: 'Won Kim',
    description: '사용자의 전체 이름',
  })
  fullName: string;

  @ApiProperty({
    example: 'https://example.com/profile.jpg',
    description: '프로필 이미지 URL',
  })
  profileImage: string;

  @ApiProperty({
    example: 'user',
    description: '사용자의 역할 (admin, user 등)',
  })
  role: string;

  @ApiProperty({
    example: '2023-09-01T12:00:00.000Z',
    description: '사용자 계정 생성 날짜',
  })
  createdAt: Date;
}
