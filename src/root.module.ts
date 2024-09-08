import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
//import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  // imports: [
  //   TypeOrmModule.forRoot({
  //     type: 'mongodb',
  //     host: 'localhost',
  //     port: 27017,
  //     username: '',
  //     password: '',
  //     database: 'test',
  //     synchronize: true,
  //   }),
  //   UserModule,
  // ],
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.local.env',
          //envFilePath: '.prod.env',
        }),
      ],
      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        synchronize: configService.get<boolean>('DB_SYNC'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class RootModule {
  constructor() {
    console.log(`Root Module`);
  }
}
