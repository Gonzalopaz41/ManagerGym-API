import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>
  ) {}

  async generatedPayment(createPaymentDto: CreatePaymentDto, clientId: string) {

    const paymentDate = new Date(createPaymentDto.paymentDate);
    const expirationDate = new Date(paymentDate);
    expirationDate.setDate(expirationDate.getDate() + 30); // Example: 30-day expiration

    const paymentGenerated = this.paymentRepository.create({
      ...createPaymentDto,
      clientId: clientId,
      expirationDate,
      paymentDate
     });
     
    return this.paymentRepository.save(paymentGenerated);
  };

  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
