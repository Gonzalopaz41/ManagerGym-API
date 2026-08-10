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
import { AssignRoutineDto } from './dto/assign-routine.dto';

@ApiTags('Routines')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Base)
@Controller()
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  //RUTINAS PERSONALES

  @Post('clients/:clientId/routines')
  @ApiOperation({ summary: 'Create a personal routine for a client, with all of its days and exercises in a single request' })
  @ApiParam({ name: 'clientId', description: 'UUID of the client the routine is assigned to' })
  @ApiResponse({ status: 201, description: 'Returns the created routine with the same shape as GET routines/:routineId: its client, its days sorted by order and each exercise with its category. It is created with type personal and becomes the active routine of the client, deactivating the previous one in the same operation, since a client can only have one active personal routine at a time' })
  @ApiResponse({ status: 400, description: 'Invalid input data or invalid UUID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  create(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Body() createRoutineDto: CreateRoutineDto) {
    return this.routinesService.createPersonal(clientId, createRoutineDto);
  };

  @Get('clients/:clientId/routines')
  @ApiOperation({ summary: 'Get everything a client trains with: their own personal routines plus the templates assigned to them' })
  @ApiParam({ name: 'clientId', description: 'UUID of the client whose routines are requested' })
  @ApiResponse({
    status: 200,
    description: 'Returns an object with two lists, not an array. personal holds the routines created for this client, newest first. templates holds the shared templates currently assigned to them. Neither list includes days or exercises, use GET routines/:routineId for a personal one and GET routines/templates/:routineId for a template',
    schema: {
      example: {
        personal: [
          {
            id: '5d4c3b2a-1e0f-4a9b-8c7d-6e5f4a3b2c1d',
            name: 'rutina de volumen - 4 días',
            description: 'enfocada en hipertrofia, 8 semanas',
            type: 'personal',
            clientId: '9c1e2b1a-7c4b-4a2e-9f3d-1b2c3d4e5f60',
            isActive: true,
            createdAt: '2026-06-13T18:24:00.000Z',
          },
        ],
        templates: [
          {
            id: '8e7d6c5b-4a39-4281-b0c1-d2e3f4a5b6c7',
            name: 'full body para principiantes',
            description: 'plantilla de 3 días',
            type: 'template',
            clientId: null,
            isActive: true,
            createdAt: '2026-06-01T10:00:00.000Z',
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  findAllByClient(@Param('clientId', ParseUUIDPipe) clientId: string) {
    return this.routinesService.findAllByClient(clientId);
  };

  @Get('clients/:clientId/routines/active')
  @ApiOperation({ summary: 'Get the active personal routine of a client, fully loaded with its days and exercises. Assigned templates are never returned here' })
  @ApiParam({ name: 'clientId', description: 'UUID of the client whose active routine is requested' })
  @ApiResponse({
    status: 200,
    description: 'Returns the active personal routine with its days sorted by order, each day with its exercises also sorted by order. Returns null when the client exists but has no active personal routine, which is a normal state and not an error. A client whose only routines are assigned templates also gets null here',
    schema: {
      nullable: true,
      example: {
        id: '5d4c3b2a-1e0f-4a9b-8c7d-6e5f4a3b2c1d',
        name: 'rutina de volumen - 4 días',
        description: 'enfocada en hipertrofia, 8 semanas',
        type: 'personal',
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
    const routine = await this.routinesService.findPersonalByClient(clientId);

    //null explicito, si devolvieramos el valor Nest mandaria un body vacio
    res.json(routine ?? null);
  }

  //PLANTILLAS
  //Van antes de routines/:routineId, si no el literal templates se toma como un UUID y da 400

  @Post('routines/templates')
  @ApiOperation({ summary: 'Create a shared template, a routine that belongs to no client and can be assigned to many' })
  @ApiResponse({ status: 201, description: 'Returns the created template with the same shape as GET routines/:routineId, with type template and client null. It is not assigned to anyone yet, use POST routines/templates/:routineId/assign for that' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  createTemplate(@Body() createRoutineDto: CreateRoutineDto){
    return this.routinesService.createTemplate(createRoutineDto);
  };

  @Get('routines/templates')
  @ApiOperation({ summary: 'Get every template, newest first. Days and exercises are not included, use GET routines/templates/:routineId for that' })
  @ApiResponse({
    status: 200,
    description: 'Returns the list of templates. An empty array is returned when there is none',
    schema: {
      example: [
        {
          id: '8e7d6c5b-4a39-4281-b0c1-d2e3f4a5b6c7',
          name: 'full body para principiantes',
          description: 'plantilla de 3 días',
          type: 'template',
          clientId: null,
          isActive: true,
          createdAt: '2026-06-01T10:00:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  getAllTemplates(){
    return this.routinesService.findAllTemplates();
  };

  @Get('routines/templates/:routineId')
  @ApiOperation({ summary: 'Get a template with its days and exercises, plus the clients it is assigned to' })
  @ApiParam({ name: 'routineId', description: 'UUID of the template to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'Returns the template with its days sorted by order, each exercise with its category, and an assignments array holding one entry per client it was assigned to, each including that client',
    schema: {
      example: {
        id: '8e7d6c5b-4a39-4281-b0c1-d2e3f4a5b6c7',
        name: 'full body para principiantes',
        description: 'plantilla de 3 días',
        type: 'template',
        clientId: null,
        isActive: true,
        createdAt: '2026-06-01T10:00:00.000Z',
        days: [
          {
            id: '7a6b5c4d-3e2f-4108-9a0b-1c2d3e4f5a6b',
            name: 'día 1 - full body',
            order: 1,
            routineId: '8e7d6c5b-4a39-4281-b0c1-d2e3f4a5b6c7',
            items: [
              {
                id: '2c3d4e5f-6a7b-4c8d-9e0f-1a2b3c4d5e6f',
                routineDayId: '7a6b5c4d-3e2f-4108-9a0b-1c2d3e4f5a6b',
                exerciseId: 'b7e6d5c4-3a2b-41c0-9d8e-7f6a5b4c3d2e',
                sets: 3,
                reps: 12,
                suggestedWeight: 40,
                notes: null,
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
        assignments: [
          {
            id: '1a2b3c4d-5e6f-4708-9a1b-2c3d4e5f6a7b',
            routineId: '8e7d6c5b-4a39-4281-b0c1-d2e3f4a5b6c7',
            clientId: '9c1e2b1a-7c4b-4a2e-9f3d-1b2c3d4e5f60',
            isActive: true,
            assignedAt: '2026-06-05T14:00:00.000Z',
            client: { id: '9c1e2b1a-7c4b-4a2e-9f3d-1b2c3d4e5f60', fullname: 'carlos perez', phone: 3811234567, active: true },
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  @ApiResponse({ status: 404, description: 'Template not found. A personal routine id also falls here, this endpoint only serves templates' })
  findTemplateWithClients(@Param('routineId', ParseUUIDPipe) routineId: string){
    return this.routinesService.findTemplateWithClients(routineId)
  };

  @Post('routines/templates/:routineId/assign')
  @ApiOperation({ summary: 'Assign a template to a client. The template is shared, assigning it does not copy it' })
  @ApiParam({ name: 'routineId', description: 'UUID of the template being assigned' })
  @ApiResponse({
    status: 201,
    description: 'Returns the created assignment including its client, with the same shape as the items of the assignments array of GET routines/templates/:routineId, so it can be pushed straight into that list without refetching. Assigning does not deactivate the personal routines of the client, both coexist',
    schema: {
      example: {
        id: '1a2b3c4d-5e6f-4708-9a1b-2c3d4e5f6a7b',
        routineId: '8e7d6c5b-4a39-4281-b0c1-d2e3f4a5b6c7',
        clientId: '9c1e2b1a-7c4b-4a2e-9f3d-1b2c3d4e5f60',
        isActive: true,
        assignedAt: '2026-06-05T14:00:00.000Z',
        client: { id: '9c1e2b1a-7c4b-4a2e-9f3d-1b2c3d4e5f60', fullname: 'carlos perez', phone: 3811234567, active: true },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID format or clientId missing' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  @ApiResponse({ status: 404, description: 'Template or client not found' })
  @ApiResponse({ status: 409, description: 'That template is already assigned to that client' })
  assign(
    @Param('routineId', ParseUUIDPipe) routineId: string,
    @Body() assignRoutineDto: AssignRoutineDto,
  ) {
    return this.routinesService.assignTemplateToClient(routineId, assignRoutineDto.clientId);
  };

  @Delete('routines/templates/:routineId/assign/:clientId')
  @ApiOperation({ summary: 'Unassign a template from a client. Only the assignment is deleted, the template itself is kept' })
  @ApiParam({ name: 'routineId', description: 'UUID of the assigned template' })
  @ApiParam({ name: 'clientId', description: 'UUID of the client losing the assignment' })
  @ApiResponse({ status: 200, description: 'Assignment deleted successfully', schema: { example: { message: 'Template unassigned successfully' } } })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  @ApiResponse({ status: 404, description: 'That template is not assigned to that client' })
  unassign(
    @Param('routineId', ParseUUIDPipe) routineId: string,
    @Param('clientId', ParseUUIDPipe) clientId: string,
  ) {
    return this.routinesService.unassignTemplate(routineId, clientId);
  }

  //COMUN A AMBAS

  @Get('routines/:routineId')
  @ApiOperation({ summary: 'Get a routine by UUID, fully loaded with its days, exercises and the client it belongs to. Works for both personal routines and templates' })
  @ApiParam({ name: 'routineId', description: 'UUID of the routine to retrieve' })
  @ApiResponse({ status: 200, description: 'Returns the routine with its client, its days sorted by order and each day with its exercises also sorted by order. Every exercise includes its category. For a template, client is null and the assigned clients are not included, use GET routines/templates/:routineId for those' })
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
    description: 'Returns the updated routine with the same shape as GET routines/:routineId: its client, its new days sorted by order and each exercise with its category. The routine keeps its id, createdAt, type and isActive, so updating it does not change which routine is the active one. Its days and exercises are deleted and recreated from the body, meaning they do get new ids. Everything runs in a single transaction, so a failure leaves the routine untouched. Editing a template changes it for every client it is assigned to',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data or invalid UUID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  @ApiResponse({ status: 404, description: 'Routine not found' })
  update(
    @Param('routineId', ParseUUIDPipe) routineId: string,
    @Body() updateRoutineDto: CreateRoutineDto
  ){
    return this.routinesService.updatePersonalFull(routineId, updateRoutineDto)
  };

  @Patch('routines/:routineId/status')
  @ApiOperation({ summary: 'Activate or deactivate a personal routine. A client can only have one active personal routine at a time. Templates are rejected, isActive means nothing for them' })
  @ApiParam({ name: 'routineId', description: 'UUID of the personal routine whose status is being changed' })
  @ApiResponse({
    status: 200,
    description: 'Returns the routine with its new status, with the same shape as GET routines/:routineId: its client, its days sorted by order and each exercise with its category. Activating it deactivates every other active routine of the same client in the same operation, so no extra request is needed. Note that those other routines are not part of the response, refetch the list if you keep it in the store',
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID format, isActive is missing or is not a boolean, or the routine is a template. Use POST and DELETE of routines/templates/:routineId/assign to control who trains with a template' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  @ApiResponse({ status: 404, description: 'Routine not found' })
  updateStatus(
    @Param('routineId', ParseUUIDPipe) routineId: string,
    @Body() updateRoutineStatusDto: UpdateRoutineStatusDto
  ){
    return this.routinesService.updateStatus(routineId, updateRoutineStatusDto.isActive);
  };

  @Delete('routines/:routineId')
  @ApiOperation({ summary: 'Delete a routine by UUID, along with its days and exercises. Works for both personal routines and templates' })
  @ApiParam({ name: 'routineId', description: 'UUID of the routine to delete' })
  @ApiResponse({ status: 200, description: 'Routine deleted successfully. Deleting a template also deletes every assignment of it, so the clients using it lose it', schema: { example: { message: 'Routine <uuid> deleted succesfully' } } })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  @ApiResponse({ status: 404, description: 'Routine not found' })
  remove(
    @Param('routineId', ParseUUIDPipe) routineId: string
  ){
    return this.routinesService.remove(routineId)
  }

}
