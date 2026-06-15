import { Payment } from "src/payments/entities/payment.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToMany(() => Payment, (payment) => payment.client)
  payments!: Payment[];

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

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt!: Date;  // soft delete — null = activa, fecha = eliminada


  @BeforeInsert()
  checkFieldBeforeInsert() {
    if(this.email) this.email = this.email.toLowerCase().trim()
    this.fullname = this.fullname.toLowerCase().trim()
  }
  
  @BeforeUpdate()
  checkFieldBeforeUpdate() {
    if(this.email) this.email = this.email.toLowerCase().trim()
    this.fullname = this.fullname.toLowerCase().trim()
  }

}

