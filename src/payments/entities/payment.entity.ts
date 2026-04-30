import { Client } from "src/clients/entities/client.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum PaymentMethod {
  CASH = 'cash',
  TRASFER = 'transfer',
};

export enum PaymentStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  ARCHIVED = 'archived'
};

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  //relacion con clientId
  // @ManyToOne(() => Client, (client) => client.payments)
  // @JoinColumn({ name: 'client_id' })
  // clientId!: string;

 @ManyToOne(() => Client, (client) => client.payments)
  @JoinColumn({ name: 'client_id' })
  client!: Client;  // ← propiedad de la relación, tipo Client

  @Column({name: 'client_id'})
  clientId!: string;  // ← propiedad para almacenar el ID del cliente

  @Column('numeric')
  amount!: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CASH
  })
  method!: PaymentMethod;

  @Column({
    name: 'payment_date',
    type: 'timestamp',
    nullable: true
  })
  paymentDate!: Date;

  @Column({
    name: 'expiration_date',
    type: 'timestamp',
    nullable: true
  })
  expirationDate!: Date;

  @Column({
    name: 'is_paid',
    type: 'boolean',
    default: false
  })
  isPaid!: boolean;

  @Column({
    name: 'status',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.ACTIVE,
  })
  status!: PaymentStatus;
}
