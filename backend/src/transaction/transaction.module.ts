import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), UserModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
