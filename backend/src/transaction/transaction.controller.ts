import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransferDto } from './dto/transfer.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Transaction')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('transfer')
  @ApiOperation({ summary: 'Transfer money to another user' })
  async transfer(@Request() req: any, @Body() transferDto: TransferDto) {
    return this.transactionService.transfer(req.user.userId, transferDto);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get transaction history' })
  async getHistory(@Request() req: any) {
    const history = await this.transactionService.getHistory(req.user.userId);
    return history.map(t => {
      // Safety check for sender/receiver wallets
      const senderUserId = t.senderWallet?.user?.id;
      const isSender = senderUserId === req.user.userId;
      
      const partyUser = isSender 
        ? t.receiverWallet?.user 
        : (t.senderWallet?.user || null);
      
      return {
        id: t.id,
        amount: t.amount,
        status: t.status,
        type: isSender ? 'DEBIT' : 'CREDIT',
        party: partyUser ? {
          name: partyUser.name,
          email: partyUser.email,
          phone: partyUser.phone
        } : { name: 'System', email: 'Internal', phone: 'N/A' },
        date: t.createdAt
      };
    });
  }
}
