import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RefreshTokens } from "../entities/refresh_tokens.entity";
import { LessThan, Repository } from "typeorm";
import { Cron, CronExpression } from "@nestjs/schedule";


@Injectable()
export class TokenCleanupCron {
  constructor(
    @InjectRepository(RefreshTokens)
    private readonly refreshTokensRepository: Repository<RefreshTokens>,
  ){}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanExpiredTokens(){
    //BORRA LOS TOKENS REVOCADOS
    const revoked = await this.refreshTokensRepository.delete({revoked: true});

    //BORRA LOS TOKENS QUE YA EXPIRARON POR FECHA
    const expired = await this.refreshTokensRepository.delete({
      expiredAt: LessThan(new Date()),
    });

    const total = (revoked.affected ?? 0) + (expired.affected ?? 0);
    console.log(`Refresh tokens cleaned: ${total}`)
  }

}
