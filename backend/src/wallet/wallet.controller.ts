import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddMoneyDto } from './dto/add-money.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Wallet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance')
  @ApiOperation({ summary: 'Get current wallet balance' })
  async getBalance(@Request() req: any) {
    return this.walletService.getBalance(req.user.userId);
  }

  @Post('add-money')
  @ApiOperation({ summary: 'Add money to wallet' })
  async addMoney(@Request() req: any, @Body() addMoneyDto: AddMoneyDto) {
    return this.walletService.addMoney(req.user.userId, addMoneyDto);
  }
}
