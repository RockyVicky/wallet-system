import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Wallet } from '../wallet/wallet.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) { }

  async create(userParams: Partial<User>): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { email: userParams.email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const wallet = new Wallet();
    const user = this.userRepository.create({
      ...userParams,
      wallet,
    });

    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email }, relations: ['wallet'] });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id }, relations: ['wallet'] });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'email', 'name', 'phone'] // Do not select password
    });
  }

  async update(id: string, updateData: Partial<User>): Promise<User | null> {
    await this.userRepository.update(id, updateData);
    return this.findById(id);
  }
}
