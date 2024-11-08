import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('POSTGRES_URI'),
        autoLoadEntities: true,
        // synchronize: true <- shouldn't be used in production, data could be lost so to avoid that simply generate your migration file. go to auth exec npm run generate:migration -- apps/auth/src/db/migrations/<NOF> on docker
        // npm run run:migration
        synchronize: false,
        entities: [UserEntity],
        migrations: ['dist/apps/auth/db/migrations/*.js'],
        migrationsRun: true,
      }),

      inject: [ConfigService],
    }),
  ],
})
export class PostgresDBModule {}
