import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column('text')
  fullname!: string;

  @Column('numeric')
  phone!: number;

  @Column('text', {
    unique: true
  })
  email!: string;

  @Column('text')
  address!: string;

  @Column('date')
  birth_date!: Date;

  @Column('text')
  observation!: string;

  @Column('boolean', {
    default: true
  })
  active!: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp'
  })
  createdAt!: Date;

  @CreateDateColumn({
    name: 'updated_at',
    type: 'timestamp'
  })
  updatedAt!: Date;


}

