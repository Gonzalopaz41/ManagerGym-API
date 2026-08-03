import { Module } from '@nestjs/common';
import { RoutinesService } from './routines.service';
import { RoutinesController } from './routines.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Routine } from './entities/routine.entity';
import { RoutineDay } from './entities/routine-day.entity';
import { RoutineItem } from './entities/routine-item.entity';
import { Client } from 'src/clients/entities/client.entity';

@Module({
  controllers: [RoutinesController],
  providers: [RoutinesService],
  imports: [
    TypeOrmModule.forFeature([Routine, RoutineDay, RoutineItem, Client])
  ]
})
export class RoutinesModule {}
