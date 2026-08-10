import { Client } from "src/clients/entities/client.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoutineDay } from "./routine-day.entity";
import { RoutineAssignment } from "./routine-assigment.entity";

export enum RoutineType {
  PERSONAL = 'personal',
  TEMPLATE = 'template',
};

@Entity('routines')
export class Routine {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  name!: string;

  @Column('text', {nullable: true})
  description?: string;

  @Column({type: 'enum', enum: RoutineType, default: RoutineType.PERSONAL})
  type!: RoutineType;

  @ManyToOne(()=> Client, {onDelete:'CASCADE', nullable: true})
  @JoinColumn({name: 'client_id'})
  client!: Client;

  @Column({name:'client_id', nullable: true})
  clientId!: string | null;

  @Column({name:'is_active', default: true})
  isActive!: boolean;

  //DAYS
  @OneToMany(()=> RoutineDay, (day)=> day.routine, {cascade: true})
  days!:RoutineDay[];

  //Relacion para rutinas TEMPLATE(los clientes asignados)
  @OneToMany(()=> RoutineAssignment, (assignment)=> assignment.routine)
  assignments!: RoutineAssignment[]



  @CreateDateColumn({name: 'created_at'})
  createdAt!: Date;
  


}
