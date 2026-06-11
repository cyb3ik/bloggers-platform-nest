import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/bloggers-platform'),
    UsersModule,
    BloggersPlatformModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
