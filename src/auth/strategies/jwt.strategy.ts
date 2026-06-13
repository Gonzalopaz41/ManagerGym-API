import { Injectable, UnauthorizedException } from "@nestjs/common";
import {  PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt'){
  constructor(
    @InjectRepository(User)
    private readonly userRepository:Repository<User>,
  ){
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET as string,
    });
  }

  async validate(payload){

    const user = await this.userRepository.findOne({
      where: {id: payload.sub}
    });

    if(!user) throw new UnauthorizedException('User not found');
    if(!user.isActive) throw new UnauthorizedException('User is inactive')

    return {sub: payload.sub, userName: payload.userName, role: payload.role}
  }
}