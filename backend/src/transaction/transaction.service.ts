import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Transaction, TransactionStatus } from './transaction.entity';
import { TransferDto } from './dto/transfer.dto';
import { UserService } from '../user/user.service';
import { Wallet } from '../wallet/wallet.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private userService: UserService,
    private dataSource: DataSource,
  ) {}

  async transfer(senderId: string, transferDto: TransferDto) {
    const sender = await this.userService.findById(senderId);
    const receiver = await this.userService.findByEmail(transferDto.receiverEmail);

    if (!sender) {
      throw new BadRequestException('Sender not found');
    }
    if (!receiver) {
      throw new BadRequestException('Receiver not found');
    }
    if (sender.id === receiver.id) {
      throw new BadRequestException('Cannot transfer money to yourself');
    }

    const amount = transferDto.amount;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const senderWallet = await queryRunner.manager.findOne(Wallet, {
        where: { id: sender.wallet.id },
        lock: { mode: 'pessimistic_write' },
      });
      const receiverWallet = await queryRunner.manager.findOne(Wallet, {
        where: { id: receiver.wallet.id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!senderWallet || !receiverWallet) {
        throw new BadRequestException('Wallet not found');
      }

      if (Number(senderWallet.balance) < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      senderWallet.balance = Number(senderWallet.balance) - amount;
      receiverWallet.balance = Number(receiverWallet.balance) + amount;

      await queryRunner.manager.save(senderWallet);
      await queryRunner.manager.save(receiverWallet);

      const transaction = new Transaction();
      transaction.senderWallet = senderWallet;
      transaction.receiverWallet = receiverWallet;
      transaction.amount = amount;
      transaction.status = TransactionStatus.COMPLETED;

      const savedTransaction = await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();
      return savedTransaction;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getHistory(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return this.transactionRepository.find({
      where: [
        { senderWallet: { id: user.wallet.id } },
        { receiverWallet: { id: user.wallet.id } }
      ],
      relations: ['senderWallet', 'senderWallet.user', 'receiverWallet', 'receiverWallet.user'],
      order: { createdAt: 'DESC' }
    });
  }
}
