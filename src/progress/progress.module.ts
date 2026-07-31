import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Progress } from './entities/progress.entity';
import { Client } from 'src/clients/entities/client.entity';
import { ExerciseEntity } from 'src/workout/entities/exercise.entity';

@Module({
  controllers: [ProgressController],
  providers: [ProgressService],
  imports: [
    TypeOrmModule.forFeature([Progress, Client, ExerciseEntity])
  ]
})
export class ProgressModule {}
