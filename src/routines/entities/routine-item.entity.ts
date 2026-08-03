import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoutineDay } from "./routine-day.entity";
import { ExerciseEntity } from "src/workout/entities/exercise.entity";


@Entity('routine_items')
export class RoutineItem {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => RoutineDay, (day) => day.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'routine_day_id' })
  routineDay!: RoutineDay;

  @Column({ name: 'routine_day_id' })
  routineDayId!: string;

  @ManyToOne(() => ExerciseEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exercise_id' })
  exercise!: ExerciseEntity;

  @Column({ name: 'exercise_id' })
  exerciseId!: string;

  @Column('int')
  sets!: number;

  @Column('int')
  reps!: number;

  @Column('numeric', { name: 'suggested_weight', nullable: true })
  suggestedWeight!: number;

  @Column('text', { nullable: true })
  notes!: string;

  @Column('int')
  order!: number;
}