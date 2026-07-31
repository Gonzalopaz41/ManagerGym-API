import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { JwtAuthGuard } from 'src/auth/guard/auth-guard.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/entities/user.entity';

@ApiTags('Progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Base)
@Controller('clients/:clientId/progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post()
  @ApiOperation({ summary: 'Record a new progress entry of an exercise for a client' })
  @ApiParam({ name: 'clientId', description: 'UUID of the client the progress belongs to' })
  @ApiResponse({ status: 201, description: 'Progress recorded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data or invalid UUID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  @ApiResponse({ status: 404, description: 'Client or exercise not found' })
  create(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Body() createProgressDto: CreateProgressDto) {
    return this.progressService.create(clientId, createProgressDto);
  };

  @Get()
  @ApiOperation({ summary: 'Get the full progress history of a client, newest record first' })
  @ApiParam({ name: 'clientId', description: 'UUID of the client whose progress is requested' })
  @ApiResponse({
    status: 200,
    description: 'Returns every progress record of the client, including its exercise and the category of that exercise',
    schema: {
      example: [
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          clientId: '9c1e2b1a-7c4b-4a2e-9f3d-1b2c3d4e5f60',
          exerciseId: 'b7e6d5c4-3a2b-41c0-9d8e-7f6a5b4c3d2e',
          sets: 4,
          reps: 10,
          weight: 60.5,
          notes: 'le costó la última serie',
          recordedAt: '2026-06-13',
          createdAt: '2026-06-13T18:24:00.000Z',
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
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  findAllByClient(@Param('clientId', ParseUUIDPipe) clientId: string) {
    return this.progressService.findAllByClient(clientId);
  };

  @Get(':exerciseId')
  @ApiOperation({ summary: 'Get the progress history of a client for one specific exercise, newest record first' })
  @ApiParam({ name: 'clientId', description: 'UUID of the client whose progress is requested' })
  @ApiParam({ name: 'exerciseId', description: 'UUID of the exercise to filter the progress by' })
  @ApiResponse({
    status: 200,
    description: 'Returns the progress records of that client for the given exercise, including the exercise itself. An empty array is returned when the client has no records for it',
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  find(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Param('exerciseId', ParseUUIDPipe) exerciseId: string
  ) {
    return this.progressService.findByExercise(clientId, exerciseId);
  };


}
