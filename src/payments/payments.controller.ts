import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { FilterPaymentDto } from './dto/filter-payment.dto';
import { JwtAuthGuard } from 'src/auth/guard/auth-guard.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/entities/user.entity';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Base)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(':clientId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Generate a new payment for a client (Admin only)' })
  @ApiParam({ name: 'clientId', description: 'UUID of the client for whom the payment is being generated' })
  @ApiResponse({ status: 201, description: 'Payment generated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data or client UUID' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid Admin token required' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  generatedPayment(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Body() createPaymentDto: CreatePaymentDto
  ) {
    return this.paymentsService.generatedPayment(createPaymentDto, clientId);
  }

  @Patch(':paymentId/archive')
  @ApiOperation({ summary: 'Archive an expired payment' })
  @ApiParam({ name: 'paymentId', description: 'UUID of the payment to archive' })
  @ApiResponse({ status: 200, description: 'Payment archived successfully' })
  @ApiResponse({ status: 400, description: 'Payment is not in expired status' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  archivePayment(
    @Param('paymentId', ParseUUIDPipe) paymentId: string,
  ) {
    return this.paymentsService.archivePayment(paymentId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments with optional filters (paginated)' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of payments', schema: { example: { payments: [], total: 0, page: 1, last_page: 1 } } })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  findAll(
    @Query() filterPaymentDto: FilterPaymentDto
  ) {
    return this.paymentsService.findAllPayments(filterPaymentDto);
  }
}
