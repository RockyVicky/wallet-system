import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Wallet } from '../wallet/wallet.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  passwordHash: string;

  @OneToOne(() => Wallet, wallet => wallet.user, { cascade: true })
  wallet: Wallet;

  @CreateDateColumn()
  createdAt: Date;
}
