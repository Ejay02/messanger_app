import { UserEntity } from '@app/shared/entities/user.entity';
import { BaseInterfaceRepository } from '../repositories/base/base.interface.repository';

export interface UsersRepositoryInterface
  extends BaseInterfaceRepository<UserEntity> {}
