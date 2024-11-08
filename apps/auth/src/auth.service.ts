import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserEntity } from '../../../libs/shared/src/entities/user.entity';
import { NewUserDTO } from './dtos/new-user.dto';
import * as bcrypt from 'bcrypt';
import { ExistingUserDTO } from './dtos/existing-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersRepositoryInterface } from '@app/shared/interfaces/users.repository.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UsersRepositoryInterface')
    private readonly usersRepository: UsersRepositoryInterface,
 
    private readonly jwtService: JwtService,
  ) {}

  async getUsers() {
    return this.usersRepository.findAll();
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.usersRepository.findByCondition({
      where: { email },
      select: ['id', 'firstName', 'lastName', 'email', 'password'],
    });
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async register(newUser: Readonly<NewUserDTO>): Promise<UserEntity> {
    const { firstName, lastName, email, password } = newUser;

    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      throw new ConflictException(`Account with email already exists`);
    }

    const hashedPassword = await this.hashPassword(password);

    const savedUser = await this.usersRepository.save({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    delete savedUser.password;

    return savedUser;
  }

  async login(existingUser: Readonly<ExistingUserDTO>) {
    const { email, password } = existingUser;

    // Find user by email
    const user = await this.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('No user exist with this email address');
    }

    // Compare provided password with hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const jwt = await this.jwtService.signAsync({
      user,
    });

    return { token: jwt };
    // return user;
  }

  async verifyJwt(jwt: string): Promise<{ exp: number }> {
    if (!jwt) {
      throw new UnauthorizedException('Invalid JWT token');
    }

    try {
      const { exp } = await this.jwtService.verifyAsync(jwt);

      return { exp };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred verifying the JWT',
      );
    }
  }
}
