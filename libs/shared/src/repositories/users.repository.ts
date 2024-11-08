import { Injectable } from '@nestjs/common';
import { UserEntity } from '@app/shared/entities/user.entity';
import { UsersRepositoryInterface } from '../interfaces/users.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';

@Injectable()
export class UsersRepository
  extends BaseAbstractRepository<UserEntity>
  implements UsersRepositoryInterface
{
  constructor(
    @InjectRepository(UserEntity)
    private readonly UserRepository: Repository<UserEntity>,
  ) {
    super(UserRepository);
  }
}
