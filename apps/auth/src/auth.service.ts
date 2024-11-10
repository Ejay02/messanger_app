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

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findByCondition({
      where: { email },
      select: ['id', 'firstName', 'lastName', 'email', 'password'],
    });
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
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

  async isPasswordValid(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.findByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await this.isPasswordValid(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  // async validateUser(email: string, password: string): Promise<UserEntity> {
  //   const user = await this.findByEmail(email);

  //   const existingUser = !!user;

  //   if (!existingUser) return null;

  //   const isPasswordValid = await this.isPasswordValid(password, user.password);

  //   if (!isPasswordValid) return null;

  //   return user;
  // }

  async login(existingUser: Readonly<ExistingUserDTO>) {
    try {
      const { email, password } = existingUser;
      const user = await this.validateUser(email, password);

      if (!user) {
        throw new UnauthorizedException(
          'No user exist with this email address',
        );
      }

      delete user.password;
      const jwt = await this.jwtService.signAsync({
        user,
      });

      return { token: jwt, user };
    } catch (error) {
      throw new Error("Couldn't complete login");
    }
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
