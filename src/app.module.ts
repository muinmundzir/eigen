import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MemberModule } from './member/member.module';
import { BookModule } from './book/book.module';
import { BorrowedBooksModule } from './borrowed-books/borrowed-books.module';
import typeorm from './config/typeorm';

@Module({
  imports: [
    MemberModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        await configService.get('typeorm'),
    }),
    BookModule,
    BorrowedBooksModule,
  ],
})
export class AppModule {}
