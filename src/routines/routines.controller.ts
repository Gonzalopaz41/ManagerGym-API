import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { RoutinesService } from './routines.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { JwtAuthGuard } from 'src/auth/guard/auth-guard.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/entities/user.entity';
import { UpdateRoutineStatusDto } from './dto/update-routine-status.dto';

@ApiTags('Routines')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Base)
@Controller()
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Post('clients/:clientId/routines')
  @ApiOperation({ summary: 'Create a routine for a client, with all of its days and exercises in a single request' })
  @ApiParam({ name: 'clientId', description: 'UUID of the client the routine is assigned to' })
  @ApiResponse({ status: 201, description: 'Returns the created routine with the same shape as GET routines/:routineId: its client, its days sorted by order and each exercise with its category. It becomes the active routine of the client and the previous one is deactivated in the same operation, since a client can only have one active routine at a time' })
  @ApiResponse({ status: 400, description: 'Invalid input data or invalid UUID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  create(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Body() createRoutineDto: CreateRoutineDto) {
    return this.routinesService.create(clientId, createRoutineDto);
  };

  @Get('clients/:clientId/routines')
  @ApiOperation({ summary: 'Get every routine of a client, newest first. Days and exercises are not included, use GET routines/:routineId for that' })
  @ApiParam({ name: 'clientId', description: 'UUID of the client whose routines are requested' })
  @ApiResponse({
    status: 200,
    description: 'Returns the routines of the client, without their days. An empty array is returned when the client has none',
    schema: {
      example: [
        {
          id: '5d4c3b2a-1e0f-4a9b-8c7d-6e5f4a3b2c1d',
          name: 'rutina de volumen - 4 días',
          description: 'enfocada en hipertrofia, 8 semanas',
          clientId: '9c1e2b1a-7c4b-4a2e-9f3d-1b2c3d4e5f60',
          isActive: true,
          createdAt: '2026-06-13T18:24:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  findAllByClient(@Param('clientId', ParseUUIDPipe) clientId: string) {
    return this.routinesService.findAllByClient(clientId);
  };

  @Get('clients/:clientId/routines/active')
  @ApiOperation({ summary: 'Get the active routine of a client, fully loaded with its days and exercises' })
  @ApiParam({ name: 'clientId', description: 'UUID of the client whose active routine is requested' })
  @ApiResponse({
    status: 200,
    description: 'Returns the active routine with its days sorted by order, each day with its exercises also sorted by order. Returns null when the client exists but has no active routine, which is a normal state and not an error',
    schema: {
      nullable: true,
      example: {
        id: '5d4c3b2a-1e0f-4a9b-8c7d-6e5f4a3b2c1d',
        name: 'rutina de volumen - 4 días',
        description: 'enfocada en hipertrofia, 8 semanas',
        clientId: '9c1e2b1a-7c4b-4a2e-9f3d-1b2c3d4e5f60',
        isActive: true,
        createdAt: '2026-06-13T18:24:00.000Z',
        days: [
          {
            id: '7a6b5c4d-3e2f-4108-9a0b-1c2d3e4f5a6b',
            name: 'día 1 - pecho y tríceps',
            order: 1,
            routineId: '5d4c3b2a-1e0f-4a9b-8c7d-6e5f4a3b2c1d',
            items: [
              {
                id: '2c3d4e5f-6a7b-4c8d-9e0f-1a2b3c4d5e6f',
                routineDayId: '7a6b5c4d-3e2f-4108-9a0b-1c2d3e4f5a6b',
                exerciseId: 'b7e6d5c4-3a2b-41c0-9d8e-7f6a5b4c3d2e',
                sets: 4,
                reps: 10,
                suggestedWeight: 60.5,
                notes: 'bajar la barra hasta el pecho, sin rebote',
                order: 1,
                exercise: {
                  id: 'b7e6d5c4-3a2b-41c0-9d8e-7f6a5b4c3d2e',
                  name: 'press banca',
                  description: 'press de banca con barra',
                  categoryId: 'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7',
                  category: { id: 'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7', name: 'pecho' },
                },
              },
            ],
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async findActiveByClient(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Res() res: Response
  ) {
    const routine = await this.routinesService.findActiveByClient(clientId);

    //null explicito, si devolvieramos el valor Nest mandaria un body vacio
    res.json(routine ?? null);
  }

  @Get('routines/:routineId')
  @ApiOperation({ summary: 'Get a routine by UUID, fully loaded with its days, exercises and the client it belongs to' })
  @ApiParam({ name: 'routineId', description: 'UUID of the routine to retrieve' })
  @ApiResponse({ status: 200, description: 'Returns the routine with its client, its days sorted by order and each day with its exercises also sorted by order. Every exercise includes its category' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  @ApiResponse({ status: 404, description: 'Routine not found' })
  findOne(@Param('routineId', ParseUUIDPipe) routineId: string){
    return this.routinesService.findOne(routineId)
  };

  @Patch('routines/:routineId')
  @ApiOperation({
    summary: 'Update a routine, replacing all of its days and exercises. The whole body is required, partial updates are not supported',
  })
  @ApiParam({ name: 'routineId', description: 'UUID of the routine to update' })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated routine with the same shape as GET routines/:routineId: its client, its new days sorted by order and each exercise with its category. The routine keeps its id, createdAt and isActive, so updating it does not change which routine is the active one. Its days and exercises are deleted and recreated from the body, meaning they do get new ids. Everything runs in a single transaction, so a failure leaves the routine untouched',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data or invalid UUID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  @ApiResponse({ status: 404, description: 'Routine not found' })
  update(
    @Param('routineId', ParseUUIDPipe) routineId: string,
    @Body() updateRoutineDto: CreateRoutineDto
  ){
    return this.routinesService.updateFull(routineId, updateRoutineDto)
  };

  @Patch('routines/:routineId/status')
  @ApiOperation({ summary: 'Activate or deactivate a routine. A client can only have one active routine at a time' })
  @ApiParam({ name: 'routineId', description: 'UUID of the routine whose status is being changed' })
  @ApiResponse({
    status: 200,
    description: 'Returns the routine with its new status, with the same shape as GET routines/:routineId: its client, its days sorted by order and each exercise with its category. Activating it deactivates every other active routine of the same client in the same operation, so no extra request is needed. Note that those other routines are not part of the response, refetch the list if you keep it in the store',
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID format or isActive is missing or is not a boolean' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  @ApiResponse({ status: 404, description: 'Routine not found' })
  updateStatus(
    @Param('routineId', ParseUUIDPipe) routineId: string,
    @Body() updateRoutineStatusDto: UpdateRoutineStatusDto
  ){
    return this.routinesService.updateStatus(routineId, updateRoutineStatusDto.isActive);
  };

  @Delete('routines/:routineId')
  @ApiOperation({ summary: 'Delete a routine by UUID, along with its days and exercises' })
  @ApiParam({ name: 'routineId', description: 'UUID of the routine to delete' })
  @ApiResponse({ status: 200, description: 'Routine deleted successfully', schema: { example: { message: 'Routine <uuid> deleted succesfully' } } })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  @ApiResponse({ status: 404, description: 'Routine not found' })
  remove(
    @Param('routineId', ParseUUIDPipe) routineId: string
  ){
    return this.routinesService.remove(routineId)
  }

}
