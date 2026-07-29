import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ExerciseEntity } from "./exercise.entity";

@Entity('categories')
export class CategoryEntity {
 
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text', {unique: true})
  name!: string;

  @OneToMany(()=> ExerciseEntity, (exercise)=> exercise.category)
  exercises!: ExerciseEntity[];
}
