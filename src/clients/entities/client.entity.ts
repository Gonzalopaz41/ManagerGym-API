import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  fullname!: string;

  @Column('numeric')
  phone!: number;

  @Column('text', {
    unique: true,
    nullable: true
  })
  email!: string;

  @Column('text', { nullable: true })
  address!: string;

  @Column('date', { nullable: true })
  birth_date!: Date;

  @Column('text', { nullable: true })
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

  @BeforeInsert()
  checkFieldBeforeInsert() {
    this.email = this.email.toLowerCase().trim()
    this.fullname = this.fullname.toLowerCase().trim()
  }
  
  @BeforeUpdate()
  checkFieldBeforeUpdate() {
    this.email = this.email.toLowerCase().trim()
    this.fullname = this.fullname.toLowerCase().trim()
  }

}

