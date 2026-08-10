import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Routine } from "./routine.entity";
import { Client } from "src/clients/entities/client.entity";


@Entity('routine_assignments')
@Unique(['routineId', 'clientId'])
export class RoutineAssignment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(()=>Routine, (routine)=> routine.assignments, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'routine_id'})
  routine!: Routine;

  @Column({name: 'routine_id'})
  routineId!: string;

  @ManyToOne(()=> Client, {onDelete:'CASCADE'})
  @JoinColumn({name: 'client_id'})
  client!: Client;

  @Column({name: 'client_id'})
  clientId!: string;

  @Column({name: 'is_active', default: true})
  isActive!: boolean;

  @CreateDateColumn({name: 'assigned_at'})
  assignedAt!: Date;
}