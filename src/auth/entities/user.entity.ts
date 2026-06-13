import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum Role{
  Base = 'base',
  Admin = 'admin'
};

@Entity('Users')
export class User {
  
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text',{unique: true})
  userName!: string;

  @Column('text',{select: false})
  @Exclude()
  password!: string;

  @Column('bool',{default: true})
  isActive!: boolean;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.Base
  })
  Role!: Role;

  @CreateDateColumn({
    name:'created_at',
    type:'timestamp'
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name:'update_at',
    type:'timestamp'
  })
  updateAt!: Date;
}
