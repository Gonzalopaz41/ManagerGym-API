import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WorkoutService } from './workout.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { JwtAuthGuard } from 'src/auth/guard/auth-guard.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/entities/user.entity';

@ApiTags('Workout')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Base)
@Controller('workout')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}
  //CATEGORIES
  @Post('categories')
  @ApiOperation({ summary: 'Create a new exercise category (muscle group)' })
  @ApiResponse({
    status: 201,
    description: 'Returns the created category, with the same shape as GET categories/:categoryId. exercises is always an empty array here',
    schema: { example: { id: 'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7', name: 'pecho', exercises: [] } },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data or a category with that name already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  createCategory(@Body() createCategory: CreateCategoryDto) {
    return this.workoutService.createCategory(createCategory);
  };

  @Get('categories')
  @ApiOperation({ summary: 'Get every category. Exercises are not included, use GET categories/:categoryId for that' })
  @ApiResponse({
    status: 200,
    description: 'Returns the full list of categories. An empty array is returned when there is none',
    schema: {
      example: [
        { id: 'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7', name: 'pecho' },
        { id: 'c3d4e5f6-a7b8-4901-b2c3-d4e5f6a7b8c9', name: 'espalda' },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  getAllCategories(){
    return this.workoutService.getAllCategories()
  }

  @Get('categories/:categoryId')
  @ApiOperation({ summary: 'Get a category by UUID with all of its exercises' })
  @ApiParam({ name: 'categoryId', description: 'UUID of the category to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'Returns the category including its exercises',
    schema: {
      example: {
        id: 'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7',
        name: 'pecho',
        exercises: [
          { id: 'b7e6d5c4-3a2b-41c0-9d8e-7f6a5b4c3d2e', name: 'press banca', description: 'press de banca con barra', categoryId: 'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7' },
        ],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  getCategories(@Param('categoryId', ParseUUIDPipe) categoryId: string){
    return this.workoutService.getCategoryById(categoryId)
  }

  @Patch('categories/:categoryId')
  @ApiOperation({ summary: 'Update a category by UUID' })
  @ApiParam({ name: 'categoryId', description: 'UUID of the category to update' })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated category including its exercises, with the same shape as GET categories/:categoryId, so the response can be written straight into the store without refetching',
    schema: {
      example: {
        id: 'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7',
        name: 'pecho',
        exercises: [
          { id: 'b7e6d5c4-3a2b-41c0-9d8e-7f6a5b4c3d2e', name: 'press banca', description: 'press de banca con barra', categoryId: 'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7' },
        ],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data or the new name is already taken' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  updateCategory(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ){
    return this.workoutService.updateCategory(categoryId, updateCategoryDto);
  };

  @Delete('categories/:categoryId')
  @ApiOperation({ summary: 'Delete a category by UUID' })
  @ApiParam({ name: 'categoryId', description: 'UUID of the category to delete' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully', schema: { example: { message: 'Category <uuid> deleted succesfully' } } })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  removeCategory(@Param('categoryId', ParseUUIDPipe) categoryId: string){
    return this.workoutService.removeCategory(categoryId)
  };

  //EXERCISES

  @Post('exercises')
  @ApiOperation({ summary: 'Create a new exercise inside a category' })
  @ApiResponse({ status: 201, description: 'Exercise created successfully, including its category', schema: { example: { id: 'b7e6d5c4-3a2b-41c0-9d8e-7f6a5b4c3d2e', name: 'press banca', description: 'press de banca con barra', categoryId: 'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7', category: { id: 'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7', name: 'pecho' } } } })
  @ApiResponse({ status: 400, description: 'Invalid input data, or an exercise with that name or description already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  createExercise(@Body() createExercise: CreateExerciseDto) {
    return this.workoutService.createExercise(createExercise);
  };

  @Get('exercises')
  @ApiOperation({ summary: 'Get every exercise of every category, each one including its category' })
  @ApiResponse({
    status: 200,
    description: 'Returns the full list of exercises with their category. An empty array is returned when there is none',
    schema: {
      example: [
        {
          id: 'b7e6d5c4-3a2b-41c0-9d8e-7f6a5b4c3d2e',
          name: 'press banca',
          description: 'press de banca con barra',
          categoryId: 'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7',
          category: { id: 'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7', name: 'pecho' },
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  getAllExercises(){
    return this.workoutService.getAllExercises()
  }

  @Get('exercises/:categoryId')
  @ApiOperation({ summary: 'Get every exercise of a category' })
  @ApiParam({ name: 'categoryId', description: 'UUID of the category whose exercises are requested' })
  @ApiResponse({
    status: 200,
    description: 'Returns the exercises of the category, each one including its category. An empty array is returned when the category has no exercises or does not exist',
    schema: {
      example: [
        {
          id: 'b7e6d5c4-3a2b-41c0-9d8e-7f6a5b4c3d2e',
          name: 'press banca',
          description: 'press de banca con barra',
          categoryId: 'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7',
          category: { id: 'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7', name: 'pecho' },
        },
      ],
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  findAll(@Param('categoryId', ParseUUIDPipe) categoryId: string){
    return this.workoutService.getExercisesByCategory(categoryId)
  };

  @Patch('exercises/:exerciseId')
  @ApiOperation({ summary: 'Update an exercise by UUID' })
  @ApiParam({ name: 'exerciseId', description: 'UUID of the exercise to update' })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated exercise including its category, with the same shape as GET exercises, so the response can be written straight into the store without refetching',
    schema: {
      example: {
        id: 'b7e6d5c4-3a2b-41c0-9d8e-7f6a5b4c3d2e',
        name: 'press banca',
        description: 'press de banca con barra',
        categoryId: 'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7',
        category: { id: 'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7', name: 'pecho' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data or the new name is already taken' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  @ApiResponse({ status: 404, description: 'Exercise not found' })
  updateExercise(
    @Param('exerciseId', ParseUUIDPipe) exerciseId: string,
    @Body() updateExerciseDto: UpdateExerciseDto
  ){
    return this.workoutService.updateExercise(exerciseId, updateExerciseDto)
  };

  @Delete('exercises/:exerciseId')
  @ApiOperation({ summary: 'Delete an exercise by UUID' })
  @ApiParam({ name: 'exerciseId', description: 'UUID of the exercise to delete' })
  @ApiResponse({ status: 200, description: 'Exercise deleted successfully', schema: { example: { message: 'Exercise <uuid> deleted succesfully' } } })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized - valid JWT required' })
  @ApiResponse({ status: 404, description: 'Exercise not found' })
  removeExercise(@Param('exerciseId', ParseUUIDPipe) exerciseId: string){
    return this.workoutService.removeExercise(exerciseId)
  }

}
