import { Client } from "src/clients/entities/client.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ExerciseEntity } from "./exercise.entity";


@Entity('progress')
export class ProgressEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(()=> Client, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'client_id'})
  client!: Client;

  @Column({name: 'client_id'})
  clientId!: string;

  @ManyToOne(() => ExerciseEntity)
  @JoinColumn({ name: 'exercise_id' })
  exercise!: ExerciseEntity;

  @Column({ name: 'exercise_id' })
  exerciseId!: string;

  @Column('int')
  reps!: number;

  @Column('numeric', { nullable: true })
  weight!: number;  // opcional — hay ejercicios sin peso

  @Column('int', { nullable: true })
  sets!: number;

  @Column('text', { nullable: true })
  notes!: string;  // observaciones del día: "le costó la última serie"

  @Column({ name: 'recorded_at', type: 'date' })
  recordedAt!: Date;  // fecha del registro

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}