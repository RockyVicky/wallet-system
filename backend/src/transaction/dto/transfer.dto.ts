import { IsEmail, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransferDto {
  @ApiProperty()
  @IsEmail()
  receiverEmail: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  amount: number;
}
