import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ExerciseEntity } from "./exercise.entity";

@Entity('categories')
export class CategoryEntity {
 
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text', {unique: true})
  name!: string;

  @OneToMany(()=> ExerciseEntity, (exercise)=> exercise.category)
  exercises!: ExerciseEntity[];

  @BeforeInsert()
    checkFieldBeforeInsert() {
      if(this.name) this.name = this.name.toLowerCase().trim()
    };
    
    @BeforeUpdate()
    checkFieldBeforeUpdate() {
      if(this.name) this.name = this.name.toLowerCase().trim()
    };
}
