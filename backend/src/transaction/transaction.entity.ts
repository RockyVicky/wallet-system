import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Wallet } from '../wallet/wallet.entity';

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Wallet, { nullable: true })
  @JoinColumn({ name: 'sender_wallet_id' })
  senderWallet: Wallet;

  @ManyToOne(() => Wallet)
  @JoinColumn({ name: 'receiver_wallet_id' })
  receiverWallet: Wallet;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING
  })
  status: TransactionStatus;

  @CreateDateColumn()
  createdAt: Date;
}
