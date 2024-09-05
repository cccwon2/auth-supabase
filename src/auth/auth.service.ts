import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { createClient } from '@supabase/supabase-js';
import { UserProfileDto } from './dto/user-profile.dto';

@Injectable()
export class AuthService {
  private supabase;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService, // Inject ConfigService
  ) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    // Validate that the environment variables are available
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Key must be provided');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async register(email: string, password: string, fullName: string) {
    // Supabase에서 사용자 등록
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(`회원가입 실패: ${error.message}`);
    }

    // Prisma를 통해 UserProfile 생성
    const userProfile = await this.prisma.userProfile.create({
      data: {
        supabaseUserId: data.user.id, // Supabase의 사용자 ID 저장
        fullName: fullName, // 사용자 이름 저장
      },
    });

    return userProfile;
  }

  async login(email: string, password: string): Promise<UserProfileDto> {
    // 1. Supabase를 통해 사용자 인증
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error('로그인 실패: ' + error.message);
    }

    if (!data.user?.confirmed_at) {
      throw new Error('이메일 인증을 완료해야 합니다.');
    }

    // 2. Supabase 사용자 ID로 Prisma에서 사용자 정보 조회
    const supabaseUserId = data.user.id;

    const userProfile = await this.prisma.userProfile.findUnique({
      where: { supabaseUserId },
    });

    if (!userProfile) {
      throw new Error('사용자 프로필을 찾을 수 없습니다.');
    }

    // 3. Prisma 사용자 정보를 DTO로 변환하여 반환
    const userProfileDto: UserProfileDto = {
      id: userProfile.id,
      fullName: userProfile.fullName,
      profileImage: userProfile.profileImage,
      role: userProfile.role,
      createdAt: userProfile.createdAt,
    };

    return userProfileDto;
  }
}
