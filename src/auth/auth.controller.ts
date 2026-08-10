import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './guard/auth-guard.guard';
import { RolesGuard } from './guard/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user (Admin only)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Username already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid Admin token required' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('register')
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.createUser(createAuthDto);
  }

  @ApiOperation({ summary: 'Login and obtain access + refresh tokens' })
  @ApiResponse({ status: 201, description: 'Returns accessToken, valid for 1 day, and refreshToken, valid for 7 days. Send the refreshToken back to auth/refresh under that exact name to get a new accessToken', schema: { example: { accessToken: 'eyJ...', refreshToken: 'eyJ...' } } })
  @ApiResponse({ status: 401, description: 'Invalid credentials or inactive user' })
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto){
    return this.authService.login(loginUserDto);
  }

  @ApiOperation({ summary: 'Refresh access token using a valid refresh token' })
  @ApiResponse({ status: 201, description: 'Returns a new accessToken. The refreshToken is not rotated, keep using the one from login until it expires', schema: { example: { accessToken: 'eyJ...' } } })
  @ApiResponse({ status: 400, description: 'refreshToken is missing or empty' })
  @ApiResponse({ status: 401, description: 'Invalid, expired or revoked refresh token' })
  @Post('refresh')
  refresh(@Body() refreshTokenDto: RefreshTokenDto){
    return this.authService.refresh(refreshTokenDto.refreshToken);
  }

  @ApiOperation({ summary: 'Logout - revokes all active refresh tokens for the current user' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Logged out successfully', schema: { example: { message: 'Logged out successfully' } } })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Request() req){
    return this.authService.logout(req.user.sub);
  }

  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Returns list of all users' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid Admin token required' })
  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  getAllUsers(){
    return this.authService.getAllUsers()
  };

  @ApiOperation({ summary: 'Update a user by ID (Admin only)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'UUID of the user to update' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid UUID or username already taken' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid Admin token required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch('users/:id')
  updateUser(@Param('id' ,ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto){
    return this.authService.updateUser(id, updateUserDto)
  }
}
