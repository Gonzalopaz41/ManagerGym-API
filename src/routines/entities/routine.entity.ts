import { Client } from "src/clients/entities/client.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoutineDay } from "./routine-day.entity";

@Entity('routines')
export class Routine {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  name!: string;

  @Column('text', {nullable: true})
  description?: string;

  @ManyToOne(()=> Client, {onDelete:'CASCADE'})
  @JoinColumn({name: 'client_id'})
  client!: Client;

  @Column({name:'client_id'})
  clientId!: string;

  @Column({name:'is_active', default: true})
  isActive!: boolean;

  //DAYS
  @OneToMany(()=> RoutineDay, (day)=> day.routine, {cascade: true})
  days!:RoutineDay[];

  @CreateDateColumn({name: 'created_at'})
  createdAt!: Date;
  


}
