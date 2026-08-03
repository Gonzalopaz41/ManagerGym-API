import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Routine } from "./routine.entity";
import { RoutineItem } from "./routine-item.entity";


@Entity('routine_days')
export class RoutineDay{
  
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  name!: string;

  @Column('int')
  order!: number;

  @ManyToOne(()=> Routine, (routine)=> routine.days, {onDelete:'CASCADE'})
  @JoinColumn({name:'routine_id'})
  routine!: Routine;

  @Column({name: 'routine_id'})
  routineId!: string;

  @OneToMany(() => RoutineItem, (item) => item.routineDay, { cascade: true })
  items!: RoutineItem[];
}