import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CategoryEntity } from "./category.entity";

@Entity('exercises')
export class ExerciseEntity {
 
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text', {unique: true})
  name!: string;

  @Column('text', {unique: true, nullable: true})
  description!: string;

  @ManyToOne(()=> CategoryEntity, (category)=> category.exercises)
  @JoinColumn({name: 'category_id'})
  category!: CategoryEntity

  @Column({ name: 'category_id' })
  categoryId!: string;
};
