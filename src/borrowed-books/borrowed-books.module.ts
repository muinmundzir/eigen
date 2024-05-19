import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookModule } from '@app/book/book.module';
import { MemberModule } from '@app/member/member.module';
import { BorrowedBooksService } from './borrowed-books.service';
import { BorrowedBooksController } from './borrowed-books.controller';
import { BorrowedBook } from './borrowed-books.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BorrowedBook]), BookModule, MemberModule],
  providers: [BorrowedBooksService],
  controllers: [BorrowedBooksController],
})
export class BorrowedBooksModule {}
