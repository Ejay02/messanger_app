import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

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
        // synchronize: true <- shouldn't be used in production, data could be lost so to avoid that simply generate your migration file with go to auth cli npm run generate:migration -- apps/auth/src/db/migrations/<NOF> on docker
      }),

      inject: [ConfigService],
    }),
  ],
})
export class PostgresDBModule {}
