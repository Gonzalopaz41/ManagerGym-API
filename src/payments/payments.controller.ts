import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import { FilterPaymentDto } from './dto/filter-payment.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(':clientId')
  @ApiOperation({ summary: 'Generate a new payment for a client' })
  @ApiParam({ name: 'clientId', description: 'UUID of the client for whom the payment is being generated' })
  @ApiParam({ name: 'createPaymentDto', description: 'Data for creating a new payment' })
  @ApiResponse({ status: 201, description: 'The payment has been successfully generated.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid input data or client ID.' })
  generatedPayment(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Body() createPaymentDto: CreatePaymentDto
  ) {
    return this.paymentsService.generatedPayment(createPaymentDto, clientId);
  }

  @Patch(':paymentId/archive')
  @ApiOperation({ summary: 'Archive a payment' })
  @ApiParam({ name: 'paymentId', description: 'UUID of the payment to archive' })
  @ApiResponse({ status: 200, description: 'The payment has been successfully archived.' })
  @ApiResponse({ status: 404, description: 'Payment not found.' })
  archivePayment(
    @Param('paymentId', ParseUUIDPipe) paymentId: string,
  ){
    return this.paymentsService.archivePayment(paymentId);
  }

  @Get()
  @ApiOperation({ summary: 'Find all payments with optional filters' })
  @ApiParam({ name: 'filterPaymentDto', description: 'Optional filters for retrieving payments' })
  @ApiResponse({ status: 200, description: 'Return all payments matching the filters' })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid filter parameters.' })
  findAll(
    @Query() filterPaymentDto: FilterPaymentDto
  ) {
    return this.paymentsService.findAllPayments(filterPaymentDto);
  }
}
