import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppDataSource from './databases/typeorm.config';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
