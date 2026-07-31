import { Module } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { WorkoutController } from './workout.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { ExerciseEntity } from './entities/exercise.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity, ExerciseEntity])
  ],
  controllers: [WorkoutController],
  providers: [WorkoutService],
})
export class WorkoutModule {}
