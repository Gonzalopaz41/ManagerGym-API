import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guard/auth-guard.guard';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RefreshTokens } from './entities/refresh_tokens.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  imports: [
    TypeOrmModule.forFeature([User, RefreshTokens]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET
    })
  ]
})
export class AuthModule {}
