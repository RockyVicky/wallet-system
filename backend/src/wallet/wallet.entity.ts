import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, user => user.wallet)
  @JoinColumn()
  user: User;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  balance: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
