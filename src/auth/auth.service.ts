import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokens } from './entities/refresh_tokens.entity';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(RefreshTokens)
    private readonly RefreshTokensRepository: Repository<RefreshTokens>,

    private readonly jwtService: JwtService,

  ){}
  
  async createUser(createUserDto: CreateUserDto) {
    try {
      const {password, userName} = createUserDto;

      const user = this.userRepository.create({
        userName,
        password: bcrypt.hashSync(password, 10)
      })

      await this.userRepository.save(user)

      return {user};
    } catch (error) {
      this.handleBDError(error)
    }    
  };

  async login(loginUserDto: LoginUserDto){
    const user = await this.userRepository.findOne({
      where: {userName: loginUserDto.userName},
      select: ['id', 'Role', 'userName', 'password'],
    });

    if(!user) throw new UnauthorizedException('User not found');

    const userValid = await bcrypt.compare(loginUserDto.password, user.password)
    if (!userValid) throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.jwtService.sign(
      {sub: user.id, userName: user.userName, role: user.Role},
      {secret: process.env.JWT_SECRET, expiresIn: '15m'}
    );

    const refreshToken = this.jwtService.sign(
      {sub: user.id},
      {secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d'}
    );

    await this.RefreshTokensRepository.save({
      userId: user.id,
      token: await bcrypt.hash(refreshToken, 10),
      expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    return {accessToken, refreshToken}
  };

  async refresh(refreshToken: string){
    //Verificar que el token sea valido
    let payload: any;

    try {
      payload = this.jwtService.verify(refreshToken,{
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (error) {
      console.log(error)
      throw new UnauthorizedException('Invalid Refresh Token');
    };

    //2- Buscamos todos los refresh tokens del usuario que no esten revocados

    const storedTokens = await this.RefreshTokensRepository.find({
      where: {userId: payload.sub, revoked: false}
    });

    //3- Comparamos el token recibido contra los hasheados en DB
    let matchedToken: RefreshTokens | null = null;

    for(const stored of storedTokens){
      const isMatch = await bcrypt.compare(refreshToken, stored.token);
      if(isMatch){
        matchedToken = stored;
        break;
      }
    };
    if(!matchedToken) throw new UnauthorizedException('Refresh token revoked');

    //4- Verificamos que no haya expirado segun nuestra DB(Doble check)

    if(matchedToken.expiredAt < new Date()) throw new UnauthorizedException('Refresh Token Expired');

    //5- Generamos nuevo accessToken

    const user = await this.userRepository.findOne({
      where:{id: payload.sub},
      select:['id', 'userName', 'Role']
    });

    if(!user) throw new UnauthorizedException('User not found');

    const newAccessToken = this.jwtService.sign(
      {sub: user.id, userName: user.userName, role: user.Role},
      {secret: process.env.JWT_SECRET, expiresIn: '15m'}
    );

    return {
      accessToken: newAccessToken
    }
  };

  async getAllUsers(){


  };

  async logout(userId: string){
    await this.RefreshTokensRepository.update(
      {userId: userId, revoked: false},
      {revoked: true}
    );
    return {message: 'Logged out successfully'}
  };


  handleBDError(error: any){
    if(error.code === '23505') throw new BadRequestException(error.detail);

    throw new InternalServerErrorException('Check server logs')
  };



}
