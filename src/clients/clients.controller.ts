import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guard/auth-guard.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/entities/user.entity';

@ApiTags('Clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Base)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({ status: 201, description: 'Client created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data or email already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.createClient(createClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all clients with their payments (paginated)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of results per page (default: 10)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of clients with payments', schema: { example: { clients: [], total: 0, page: 1, last_page: 1 } } })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.clientsService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiOperation({ summary: 'Find client by UUID or partial fullname' })
  @ApiParam({ name: 'term', description: 'UUID of the client or beginning of their fullname' })
  @ApiResponse({ status: 200, description: 'Returns matching client(s) with payments' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  @ApiResponse({ status: 404, description: 'No client found for the given term' })
  findByTerm(@Param('term') term: string) {
    return this.clientsService.findByTerm(term);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a client by UUID' })
  @ApiParam({ name: 'id', description: 'UUID of the client to update' })
  @ApiResponse({ status: 200, description: 'Client updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid UUID or email already taken' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClientDto: UpdateClientDto
  ) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete a client by UUID' })
  @ApiParam({ name: 'id', description: 'UUID of the client to delete' })
  @ApiResponse({ status: 200, description: 'Client deleted successfully', schema: { example: { message: 'Client with id <uuid> has been removed' } } })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientsService.remove(id);
  }
}
