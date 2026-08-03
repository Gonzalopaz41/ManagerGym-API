import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Progress } from './entities/progress.entity';
import { Repository } from 'typeorm';
import { Client } from 'src/clients/entities/client.entity';
import { ExerciseEntity } from 'src/workout/entities/exercise.entity';

@Injectable()
export class ProgressService {

  constructor(
    @InjectRepository(Progress)
    private readonly progressRepository: Repository<Progress>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,

    @InjectRepository(ExerciseEntity)
    private readonly exerciseRepository: Repository<ExerciseEntity>
  ){}

  async create(clientId: string, createProgressDto: CreateProgressDto) {
    try {
      //validamos que el cliente exista
      const client = await this.clientRepository.findOneBy({id: clientId});
      if(!client) throw new NotFoundException(`Client ${clientId} not  found`);

      //validamos que el ejercicio exista
      const exercise = await this.exerciseRepository.findOneBy({id: createProgressDto.exerciseId});
      if(!exercise) throw new NotFoundException(`Exercise ${createProgressDto.exerciseId} not  found`);

      const progress = this.progressRepository.create({
        ...createProgressDto,
        recordedAt: new Date(createProgressDto.recordedAt),
        clientId,
      });

      const {id} = await this.progressRepository.save(progress);

      //lo recargamos con el ejercicio para devolver la misma forma que el GET
      return await this.progressRepository.findOne({
        where: {id},
        relations: ['exercise', 'exercise.category']
      });
    } catch (error) {
      console.log(error)
      this.handleDBError(error)
    }
  };

  async findAllByClient(clientId: string) {
    try {
      const client = await this.clientRepository.findOneBy({id:  clientId});
      if(!client) throw new NotFoundException(`Client ${clientId} not found`);

      return await this.progressRepository.find({
        where: {clientId},
        relations: ['exercise', 'exercise.category'],
        order: {recordedAt: 'DESC'}
      });

    } catch (error) {
      console.log(error)
      this.handleDBError(error)
    }
  };

  async findByExercise(clientId: string, exerciseId: string) {
    try {
    
      const client = await this.clientRepository.findOneBy({id: clientId});
      if(!client) throw new NotFoundException(`Client ${clientId} not found`);

      return await this.progressRepository.find({
        where: {clientId, exerciseId},
        relations: ['exercise', 'exercise.category'],
        order: {recordedAt: 'DESC'}
      });
  
    } catch (error) {
      console.log(error)
      this.handleDBError(error)
    }
  };


  handleDBError(error: any){
    if(error instanceof HttpException) throw error;
    throw new InternalServerErrorException(`Unexpected error, check server error:: ${error}`)
  };
}
