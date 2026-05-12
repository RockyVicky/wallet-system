import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { AddMoneyDto } from './dto/add-money.dto';
import { Transaction, TransactionStatus } from '../transaction/transaction.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async getBalance(userId: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({ where: { user: { id: userId } } });
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    return wallet;
  }

  async addMoney(userId: string, addMoneyDto: AddMoneyDto): Promise<Wallet> {
    const wallet = await this.getBalance(userId);
    wallet.balance = Number(wallet.balance) + addMoneyDto.amount;
    const savedWallet = await this.walletRepository.save(wallet);

    const transaction = new Transaction();
    transaction.senderWallet = null as any;
    transaction.receiverWallet = savedWallet;
    transaction.amount = addMoneyDto.amount;
    transaction.status = TransactionStatus.COMPLETED;
    await this.transactionRepository.save(transaction);

    return savedWallet;
  }
}
