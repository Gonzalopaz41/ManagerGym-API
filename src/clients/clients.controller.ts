import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiParam({ name: 'createClientDto', description: 'Data for creating a new client' })
  @ApiResponse({ status: 201, description: 'The client has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid input data.' })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.createClient(createClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all clients' })
  @ApiResponse({ status: 200, description: 'Return all clients and payments' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.clientsService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiOperation({ summary: 'Find client by term or ID' })
  @ApiResponse({ status: 200, description: 'Return client matching the term or ID' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  findByTerm(@Param('term') term: string) {
    return this.clientsService.findByTerm(term);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a client' })
  @ApiResponse({ status: 200, description: 'The client has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateClientDto: UpdateClientDto
  ) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a client' })
  @ApiResponse({ status: 200, description: 'The client has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid ID.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientsService.remove(id);
  }
}
