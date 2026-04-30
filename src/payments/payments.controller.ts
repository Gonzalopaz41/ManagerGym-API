import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import { FilterPaymentDto } from './dto/filter-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(':clientId')
  generatedPayment(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Body() createPaymentDto: CreatePaymentDto
  ) {
    return this.paymentsService.generatedPayment(createPaymentDto, clientId);
  }

  @Patch(':paymentId/archive')
  archivePayment(
    @Param('paymentId', ParseUUIDPipe) paymentId: string,
  ){
    return this.paymentsService.archivePayment(paymentId);
  }

  @Get()
  findAll(
    @Query() filterPaymentDto: FilterPaymentDto
  ) {
    return this.paymentsService.findAllPayments(filterPaymentDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }
}
