import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Client } from 'src/clients/entities/client.entity';
import { PaymentExpirationsCrons } from './crons/payment-expirations.crons';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Client])
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    PaymentExpirationsCrons
  ],
})
export class PaymentsModule {}
