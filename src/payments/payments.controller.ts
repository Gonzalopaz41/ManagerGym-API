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
  @ApiResponse({
    status: 201,
    description: 'Returns the generated payment including its client, with the same shape as the items of GET payments. expirationDate is set to 30 days after paymentDate',
    schema: {
      example: {
        id: '4f3e2d1c-0b9a-4876-8f7e-6d5c4b3a2f1e',
        clientId: '9c1e2b1a-7c4b-4a2e-9f3d-1b2c3d4e5f60',
        amount: 5000,
        method: 'cash',
        paymentDate: '2026-06-13T00:00:00.000Z',
        expirationDate: '2026-07-13T00:00:00.000Z',
        isPaid: false,
        status: 'active',
        client: { id: '9c1e2b1a-7c4b-4a2e-9f3d-1b2c3d4e5f60', fullname: 'carlos perez', phone: 3811234567, active: true },
      },
    },
  })
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
  @ApiResponse({
    status: 200,
    description: 'Returns the archived payment including its client, with the same shape as the items of GET payments, so the response can be written straight into the store without refetching. Only status changes, to archived',
    schema: {
      example: {
        id: '4f3e2d1c-0b9a-4876-8f7e-6d5c4b3a2f1e',
        clientId: '9c1e2b1a-7c4b-4a2e-9f3d-1b2c3d4e5f60',
        amount: 5000,
        method: 'cash',
        paymentDate: '2026-06-13T00:00:00.000Z',
        expirationDate: '2026-07-13T00:00:00.000Z',
        isPaid: false,
        status: 'archived',
        client: { id: '9c1e2b1a-7c4b-4a2e-9f3d-1b2c3d4e5f60', fullname: 'carlos perez', phone: 3811234567, active: true },
      },
    },
  })
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
