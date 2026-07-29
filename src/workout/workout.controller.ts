import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Controller('workout')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}
  //CATEGORIES
  @Post('categories')
  createCategory(@Body() createCategory: CreateCategoryDto) {
    return this.workoutService.createCategory(createCategory);
  };

  @Get('categories/:categoryId')
  getCategories(@Param('categoryId', ParseUUIDPipe) categoryId: string){
    return this.workoutService.getCategoryById(categoryId)
  }

  @Patch('categories/:categoryId')
  updateCategory(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ){
    return this.workoutService.updateCategory(categoryId, updateCategoryDto);   
  };
  
  @Delete('categories/:categoryId')
  removeCategory(@Param('categoryId', ParseUUIDPipe) categoryId: string){
    return this.workoutService.removeCategory(categoryId)
  };

  //EXERCISES

  @Post('exercises')
  createExercise(@Body() createExercise: CreateExerciseDto) {
    return this.workoutService.createExercise(createExercise);
  };

  @Get('exercises/:categoryId')
  findAll(@Param('categoryId', ParseUUIDPipe) categoryId: string){
    return this.workoutService.getExercisesByCategory(categoryId)
  };

  @Patch('exercises/:exerciseId')
  updateExercise(
    @Param('exerciseId', ParseUUIDPipe) exerciseId: string,
    @Body() updateExerciseDto: UpdateExerciseDto
  ){
    return this.workoutService.updateExercise(exerciseId, updateExerciseDto)
  };

  @Delete('exercises/:exerciseId')
  removeExercise(@Param('exerciseId', ParseUUIDPipe) exerciseId: string){
    return this.workoutService.removeExercise(exerciseId)
  }

}
