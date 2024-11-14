import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    UserModule,
    TaskModule,
    ConfigModule.forRoot(),
    JwtModule.register({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: '1d' }, global: true }),
    MongooseModule.forRoot(process.env.URL_MONGO_DB),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
