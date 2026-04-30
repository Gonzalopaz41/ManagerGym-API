import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/pagination.dto';
import { Client } from 'src/clients/entities/client.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>
  ) {}

  async generatedPayment(createPaymentDto: CreatePaymentDto, clientId: string) {

    // const client = await this.clientRepository.findOneBy({ id: clientId });
    // if (!client) throw new Error(`Client with id ${clientId} not found`);

    const paymentDate = new Date(createPaymentDto.paymentDate);
    const expirationDate = new Date(paymentDate);
    expirationDate.setDate(expirationDate.getDate() + 30); // Example: 30-day expiration

    const paymentGenerated = this.paymentRepository.create({
      amount: createPaymentDto.amount,
      method: createPaymentDto.method,
      expirationDate,
      paymentDate,
      clientId
    });
     
    return this.paymentRepository.save(paymentGenerated);
  };

  async findAllPayments(paginationDto: PaginationDto) {
    const {limit = 10, page = 1} = paginationDto;

    const [payments, total] = await this.paymentRepository.findAndCount({
      order: { expirationDate: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
      relations: ['client']
    });

    return {
      payments,
      total,
      page,
      last_page: Math.ceil(total / limit)
    };
  };

  // Método para archivar un pago
  async archivePayment(paymentId: string){
    const payment = await this.paymentRepository.findOneBy({id: paymentId});
    if(!payment) throw new NotFoundException(`Payment with id ${paymentId} not found`);
    if(payment.status !== PaymentStatus.EXPIRED) throw new BadRequestException(`Only expired payments can be archived`);
    
    payment.status = PaymentStatus.ARCHIVED;
    
    return this.paymentRepository.save(payment);
  };

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
