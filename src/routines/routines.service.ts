import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Routine, RoutineType } from './entities/routine.entity';
import { DataSource, Repository } from 'typeorm';
import { Client } from 'src/clients/entities/client.entity';
import { UpdateRoutineStatusDto } from './dto/update-routine-status.dto';
import { RoutineDay } from './entities/routine-day.entity';
import { RoutineItem } from './entities/routine-item.entity';
import { RoutineAssignment } from './entities/routine-assigment.entity';

@Injectable()
export class RoutinesService {
  constructor(
    @InjectRepository(Routine)
    private readonly routineRepository: Repository<Routine>,

    @InjectRepository(RoutineAssignment)
    private readonly assignmentRepository: Repository<RoutineAssignment>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,

    private readonly dataSource: DataSource,
  ){}

  //RUTINAS PERSONALES

  async createPersonal(clientId: string, createRoutineDto: CreateRoutineDto) {
    try {
      const client = await this.clientRepository.findOneBy({id: clientId});
      if(!client) throw new NotFoundException(`Client ${clientId} not found`);

      //la nueva rutina queda activa, asi que desactivamos la anterior
      await this.deactivateRoutinesOf(clientId);

      const routine = this.routineRepository.create({
        ...createRoutineDto,
        clientId,
        type: RoutineType.PERSONAL
      });

      const {id} = await this.routineRepository.save(routine);

      //la recargamos para devolver la misma forma que el GET
      return await this.findOne(id);
    } catch (error) {
      console.log(error)
      this.handleDBError(error);
    }
  };

  async findPersonalByClient(clientId: string){
    try {
      const client = await this.clientRepository.findOneBy({id: clientId});
      if(!client) throw new NotFoundException(`Client ${clientId} not found`);

      const routine = await this.routineRepository.findOne({
        where: {clientId, type: RoutineType.PERSONAL , isActive: true},
        relations: ['days', 'days.items', 'days.items.exercise', 'days.items.exercise.category'],
        order: {days: {order: 'ASC', items: {order: 'ASC'}}},
      });

      //sin rutina activa no es un error, el front distingue por el null
      return routine;
    } catch (error) {
      console.log(error)
      this.handleDBError(error);
    }
  };

  async updatePersonalFull(routineId: string, updateRoutineDto: CreateRoutineDto){
    try {
      await this.dataSource.transaction(async (manager) => {
      const routine = await manager.findOne(Routine, {
      where: { id: routineId },
      relations: ['days', 'days.items'],
    });
    if (!routine) throw new NotFoundException('Routine not found');

    // borramos solo los días viejos (items caen en cascada), la rutina se mantiene
    await manager.remove(routine.days);

    // actualizamos campos simples — id y createdAt intactos
    routine.name        = updateRoutineDto.name;
    routine.description = updateRoutineDto.description;

    // recreamos los días con los datos corregidos
    routine.days = updateRoutineDto.days.map((day) =>
      manager.create(RoutineDay, {
        ...day,
        items: day.items.map((item) => manager.create(RoutineItem, item)),
      }),
    );

    await manager.save(routine);  // conserva el MISMO id y createdAt
  });

      //la recargamos para devolver la misma forma que el GET
      return await this.findOne(routineId);
    } catch (error) {
      console.log(error)
      this.handleDBError(error)
    }
  };

  async updateStatus(routineId: string, isActive: boolean){
    try {
      const routine = await this.routineRepository.findOneBy({id: routineId});
      if (!routine) throw new NotFoundException(`Routine with id ${routineId} not found`);

      //isActive solo tiene sentido en las personales, una plantilla no se activa
      if(routine.type !== RoutineType.PERSONAL || !routine.clientId)
        throw new BadRequestException('Only personal routines can be activated or deactivated');

      if(isActive) await this.deactivateRoutinesOf(routine.clientId);

      routine.isActive = isActive;

      await this.routineRepository.save(routine)

      //la recargamos para devolver la misma forma que el GET
      return await this.findOne(routineId)
    } catch (error) {
      console.log(error)
      this.handleDBError(error)
    }
  };

  //Un cliente solo puede tener una rutina activa a la vez
  private async deactivateRoutinesOf(clientId: string){
    await this.routineRepository.update(
      {clientId, isActive: true},
      {isActive: false}
    );
  };

  // PLANTILLAS

  async createTemplate(createRoutineDto: CreateRoutineDto){
    try {
      const routine = this.routineRepository.create({
        ...createRoutineDto,
        type: RoutineType.TEMPLATE,
        clientId: null,
      });
      
      const {id} = await this.routineRepository.save(routine);
    
      return await this.findOne(id);
    } catch (error) {
      console.log(error)
      this.handleDBError(error)
    }
  };

  async findAllTemplates(){
    try {
      return await this.routineRepository.find({
        where: {type: RoutineType.TEMPLATE},
        order: {createdAt: 'DESC'}
      });
    } catch (error) {
      console.log(error)
      this.handleDBError(error)
    }
  };

  async findTemplateWithClients(routineId: string){
    try {
      const routine = await this.routineRepository.findOne({
        where: {id: routineId, type: RoutineType.TEMPLATE},
        relations: ['days', 'days.items', 'days.items.exercise', 'days.items.exercise.category', 'assignments', 'assignments.client'],
        order: {days: {order: 'ASC', items: {order:'ASC'}}}
      });

      if(!routine) throw new NotFoundException(`Template with id ${routineId} not found`);

      return routine;
    } catch (error) {
      console.log(error)
      this.handleDBError(error)
    }
  };

  async assignTemplateToClient(routineId: string, clientId: string){
    try {
          const routine = await this.routineRepository.findOneBy({ id: routineId, type: RoutineType.TEMPLATE });
          if (!routine) throw new NotFoundException(`Template with id ${routineId} not found`);

          const client = await this.clientRepository.findOneBy({ id: clientId });
          if (!client) throw new NotFoundException(`Client with id ${clientId} not found`);

          const existing = await this.assignmentRepository.findOneBy({ routineId, clientId });
          if (existing) throw new ConflictException('This template is already assigned to this client');

          const assignment = this.assignmentRepository.create({ routineId, clientId });
          const {id} = await this.assignmentRepository.save(assignment);

          //lo recargamos con el cliente, misma forma que los items de assignments del GET
          return await this.assignmentRepository.findOne({
            where: {id},
            relations: ['client']
          });
        } catch (error) {
          this.handleDBError(error);
        };
  };

  async unassignTemplate(routineId: string, clientId: string) {
    try {
      const assignment = await this.assignmentRepository.findOneBy({ routineId, clientId });
      if (!assignment) throw new NotFoundException('Assignment not found');

      await this.assignmentRepository.remove(assignment);
      return { message: 'Template unassigned successfully' };
    } catch (error) {
      this.handleDBError(error);
    }
  }


  //COMUN A AMBOS

  //// todas las rutinas de un cliente: sus personales + las plantillas asignadas
  async findAllByClient(clientId: string){
    try {
      //RUTINAS PERSONALES
      const personal = await this.routineRepository.find({
        where: {clientId, type: RoutineType.PERSONAL},
        order: {createdAt: 'DESC'},
      });

      //PLANTILLAS ASIGNADAS
      const assignments = await this.assignmentRepository.find({
        where: {clientId, isActive: true},
        relations: ['routine'],
      });

      const templates = assignments.map((a)=> a.routine);

      return {personal, templates};
    } catch (error) {
      console.log(error)
      this.handleDBError(error)
    }
  };

  async findOne(routineId: string){
    try {
      const routine = await this.routineRepository.findOne({
        where: {id: routineId},
        relations: ['days', 'days.items', 'days.items.exercise', 'days.items.exercise.category', 'client'],
        order: {days: {order: 'ASC', items: {order: 'ASC'}}},
      })

      if (!routine) throw new NotFoundException(`Routine with id ${routineId} not found`);

      return routine;
    } catch (error) {
      console.log(error)
      this.handleDBError(error)
    }
  };

  async remove(routineId: string){
    try {
      const routine = await this.routineRepository.findOneBy({id: routineId});
      if (!routine) throw new NotFoundException(`Routine with id ${routineId} not found`);
      
      await this.routineRepository.remove(routine);

      return {message: `Routine ${routineId} deleted succesfully`};    
    } catch (error) {
      console.log(error)
      this.handleDBError(error)
    }
  };

  handleDBError(error: any){
    if(error instanceof HttpException) throw error;

    throw new InternalServerErrorException(`Unexpected error, check server logs:: ${error}`)
  };

  
}
