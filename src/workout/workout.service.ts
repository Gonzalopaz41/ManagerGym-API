import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { ExerciseEntity } from './entities/exercise.entity';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class WorkoutService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,

    @InjectRepository(ExerciseEntity)
    private readonly exerciseRepository: Repository<ExerciseEntity>,
  ){}

  //CATEGORIES
  
  async createCategory(createCategory: CreateCategoryDto) {
    try {
      const category = this.categoryRepository.create(createCategory)
  
      return await this.categoryRepository.save(category)
    } catch (error) {
      console.log(error)
      this.handleDbError(error)
    }
  };

  async getAllCategories(){
    try {
      return await this.categoryRepository.find()

    } catch (error) {
      console.log(error)
      this.handleDbError(error);
    }    
  };
  
  async getCategoryById(categoryId: string){
    try {
      const category = await this.categoryRepository.findOne({
        where: {id: categoryId},
        relations:['exercises']
      });

      if(!category) throw new NotFoundException('Category not found')
      
        console.log(category)

      return category
    } catch (error) {
      console.log(error)
      this.handleDbError(error)      
    }
  };

  async updateCategory(categoryId: string, updateCategoryDto: UpdateCategoryDto){
    try {
      const category = await this.categoryRepository.preload({
        id: categoryId,
        ...updateCategoryDto
      });

      if(!category) throw new NotFoundException('Category not found');

      return await this.categoryRepository.save(category);

    } catch (error) {
      console.log(error)
      this.handleDbError(error)
    }
  };

  async removeCategory (categoryId: string){
    try {
    
      const category = await this.categoryRepository.findOneBy({id: categoryId});
      
      if(!category) throw new NotFoundException('Category not found');

      await this.categoryRepository.remove(category);

      return {message: `Category ${categoryId} deleted succesfully`}
      
    } catch (error) {
      console.log(error)
      this.handleDbError(error);
    }
  };

  //EXERCISES
  
  async createExercise(createExercise: CreateExerciseDto) {
    try {
      const exercise = this.exerciseRepository.create(createExercise)
      return await this.exerciseRepository.save(exercise)
      
    } catch (error) {
      console.log(error)
      this.handleDbError(error)
    }
  };

   async getAllExercises(){
    try {
      return await this.exerciseRepository.find({relations:['category']})
      
    } catch (error) {
      console.log(error)
      this.handleDbError(error);
    }    
  };


  async getExercisesByCategory(categoryId:string){
    try {
      return await this.exerciseRepository.find({
        where: categoryId ? {categoryId} : {},
        relations: ['category']
      })
    } catch (error) {
      console.log(error)
      this.handleDbError(error)
    }
  }

  async updateExercise(exerciseId: string, updateExerciseDto: UpdateExerciseDto){
    try {
      const exercise = await this.exerciseRepository.preload({
        id: exerciseId,
        ...updateExerciseDto
      });

      if(!exercise) throw new NotFoundException('Exercise not found');

      return await this.exerciseRepository.save(exercise);

    } catch (error) {
      console.log(error)
      this.handleDbError(error)
    }
  };

  async removeExercise(exerciseId: string){
    try {
      const exercise = await this.exerciseRepository.findOneBy({id: exerciseId});
      
      if(!exercise) throw new NotFoundException('Exercise not found');

      await this.exerciseRepository.remove(exercise);

      return {message: `Exercise ${exerciseId} deleted succesfully`}

    } catch (error) {
      console.log(error)
      this.handleDbError(error)
    }
  };

  handleDbError(error: any){
    if(error instanceof HttpException) throw error;

    if(error.code === '23505'){
      throw new BadRequestException(error.detail)
    }

    throw new InternalServerErrorException(`Unexpected error, check server logs :: ${error}`)
  };
}
