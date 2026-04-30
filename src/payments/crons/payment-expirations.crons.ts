import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Payment, PaymentStatus } from "../entities/payment.entity";
import { Repository } from "typeorm";
import { Cron, CronExpression } from "@nestjs/schedule";


@Injectable()
export class PaymentExpirationsCrons {  
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ){}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async markExpiredPayments(){
    const result = await this.paymentRepository
    .createQueryBuilder()
    .update()
    .set({status: PaymentStatus.EXPIRED})
    .where('expiration_date < :now', { now: new Date() })
    .andWhere('status = :status', {status: PaymentStatus.ACTIVE})
    .execute();

    console.log(`Cron: Marked ${result.affected} payments as expired.`);
  }
}