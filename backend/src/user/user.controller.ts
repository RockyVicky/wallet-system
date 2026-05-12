import { Controller, Get, Post, Request, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all registered users' })
  async findAll() {
    return this.userService.findAll();
  }

  @Post('profile')
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(@Request() req: any, @Body() updateData: any) {
    return this.userService.update(req.user.userId, updateData);
  }
}
