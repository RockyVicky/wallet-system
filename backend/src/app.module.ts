import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/user.entity';
import { Wallet } from './wallet/wallet.entity';
import { Transaction } from './transaction/transaction.entity';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // Support for single connection string (Neon/Render)
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'wallet_db',
      entities: [User, Wallet, Transaction],
      synchronize: true, // For development only
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
    }),
    UserModule,
    WalletModule,
    TransactionModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
