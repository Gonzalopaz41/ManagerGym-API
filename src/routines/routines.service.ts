import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Routine } from './entities/routine.entity';
import { DataSource, Repository } from 'typeorm';
import { Client } from 'src/clients/entities/client.entity';
import { UpdateRoutineStatusDto } from './dto/update-routine-status.dto';
import { RoutineDay } from './entities/routine-day.entity';
import { RoutineItem } from './entities/routine-item.entity';

@Injectable()
export class RoutinesService {
  constructor(
    @InjectRepository(Routine)
    private readonly routineRepository: Repository<Routine>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,

    private readonly dataSource: DataSource,
  ){}


  async create(clientId: string, createRoutineDto: CreateRoutineDto) {
    try {
      const client = await this.clientRepository.findOneBy({id: clientId});
      if(!client) throw new NotFoundException(`Client ${clientId} not found`);

      //la nueva rutina queda activa, asi que desactivamos la anterior
      await this.deactivateRoutinesOf(clientId);

      const routine = this.routineRepository.create({
        ...createRoutineDto,
        clientId
      });

      const {id} = await this.routineRepository.save(routine);

      //la recargamos para devolver la misma forma que el GET
      return await this.findOne(id);
    } catch (error) {
      console.log(error)
      this.handleDBError(error);
    }
  };

  async findAllByClient(clientId: string){
    try {
      const client = await this.clientRepository.findOneBy({id: clientId});
      if(!client) throw new NotFoundException(`Client ${clientId} not found`);

      return await this.routineRepository.find({
        where: {clientId},
        order: {createdAt: 'DESC'},
      });
    } catch (error) {
      console.log(error)
      this.handleDBError(error)
    }
  };

  async findActiveByClient(clientId: string){
    try {
      const client = await this.clientRepository.findOneBy({id: clientId});
      if(!client) throw new NotFoundException(`Client ${clientId} not found`);

      const routine = await this.routineRepository.findOne({
        where: {clientId, isActive: true},
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

  async findOne(routineId){
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
  
  async updateFull(routineId: string, updateRoutineDto: CreateRoutineDto){
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
  // async updateFull(routineId: string, updateRoutineDto: CreateRoutineDto){
  //   try {
  //     const routine = await this.routineRepository.findOneBy({id: routineId});
  //     if (!routine) throw new NotFoundException(`Routine with id ${routineId} not found`);
  
  //     const clientId = routine.clientId
  //     //Borramos la rutina vieja (los dias e items se borran en cascada)
  //     await this.routineRepository.remove(routine);

  //     //La nueva rutina queda activa, asi que desactivamos las demas
  //     await this.deactivateRoutinesOf(clientId);

  //     //Creamos la nueva con los datos actualizados

  //     const newRoutine = this.routineRepository.create({
  //       ...updateRoutineDto,
  //       clientId
  //     });
  
  //     return this.routineRepository.save(newRoutine);
  //   } catch (error) {
  //     console.log(error)
  //     this.handleDBError(error)
  //   }
  // };

  async updateStatus(routineId: string, isActive: boolean){
    try {
      const routine = await this.routineRepository.findOneBy({id: routineId});
      if (!routine) throw new NotFoundException(`Routine with id ${routineId} not found`);
      
      if(isActive) await this.deactivateRoutinesOf(routine.clientId);

      routine.isActive = isActive;

      await this.routineRepository.save(routine)

      //la recargamos para devolver la misma forma que el GET
      return await this.findOne(routineId)
    } catch (error) {
      console.log(error)
      this.handleDBError(error)
    }
  }

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

  //Un cliente solo puede tener una rutina activa a la vez
  private async deactivateRoutinesOf(clientId: string){
    await this.routineRepository.update(
      {clientId, isActive: true},
      {isActive: false}
    );
  };

  handleDBError(error: any){
    if(error instanceof HttpException) throw error;

    throw new InternalServerErrorException(`Unexpected error, check server logs:: ${error}`)
  };

  
}
