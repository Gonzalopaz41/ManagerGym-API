import { Client } from "src/clients/entities/client.entity";
import { ExerciseEntity } from "src/workout/entities/exercise.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('progress')
export class Progress {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(()=> Client, {onDelete:'CASCADE'})
  @JoinColumn({name: 'client_id'})
  client!: Client;

  @Column({name: 'client_id'})
  clientId!: string;

  @ManyToOne(() => ExerciseEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exercise_id' })
  exercise!: ExerciseEntity;

  @Column({ name: 'exercise_id' })
  exerciseId!: string;

  @Column('int')
  sets!: number;

  @Column('int')
  reps!: number;

  @Column('numeric', { nullable: true })
  weight!: number;

  @Column('text', { nullable: true })
  notes!: string;

  @Column({ name: 'recorded_at', type: 'date' })
  recordedAt!: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
