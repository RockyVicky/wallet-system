import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddMoneyDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  amount: number;
}
