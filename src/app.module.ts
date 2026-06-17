import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { TestingModule } from './modules/testing/testing.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://admin:1234pass@cluster0.sbxkzzw.mongodb.net/?appName=Cluster0'),
    TestingModule,
    UsersModule,
    BloggersPlatformModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
