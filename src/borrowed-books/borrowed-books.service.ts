import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { BorrowedBook } from './borrowed-books.entity';
import { CreateBorrow } from './dto/create-borrow.dto';
import { Book } from '@app/book/book.entity';
import { Member } from '@app/member/member.entity';
import { UpdateBorrow } from './dto/update-borrow.dto';

@Injectable()
export class BorrowedBooksService {
  constructor(
    @InjectRepository(BorrowedBook)
    private borrowedBooksRepository: Repository<BorrowedBook>,
  ) {}

  async getAllBorrowedBooks(): Promise<BorrowedBook[]> {
    try {
      return await this.borrowedBooksRepository.find({
        relations: ['member', 'book'],
      });
    } catch (error) {
      throw error;
    }
  }

  async borrowBook(inputDto: CreateBorrow): Promise<BorrowedBook> {
    try {
      const { memberId, bookId } = inputDto;

      // check if member already borrowed two books
      if (await this.isLimitBookBorrowed(memberId))
        throw new ForbiddenException('Borrowed books is limited to two books');

      // check if book is already borrowed
      if (await this.isBookBorrowed(bookId))
        throw new ForbiddenException(
          'Book is already borrowed by other member',
        );

      const data = new BorrowedBook();
      data.memberId = memberId;
      data.bookId = bookId;

      return this.borrowedBooksRepository.save(data);
    } catch (error) {
      throw error;
    }
  }

  async returnBook(inputDto: UpdateBorrow): Promise<BorrowedBook> {
    try {
      const { memberId, bookId } = inputDto;

      // check if book is borrowed and not yet returned
      const borrowedBook = await this.borrowedBooksRepository.findOne({
        where: {
          memberId: memberId,
          bookId: bookId,
          returnedAt: IsNull(),
        },
      });

      if (!borrowedBook)
        throw new NotFoundException('Borrowed book data not found.');

      borrowedBook.returnedAt = new Date();

      return await this.borrowedBooksRepository.save(borrowedBook);
    } catch (error) {
      throw error;
    }
  }

  async isBookBorrowed(bookId: string): Promise<boolean> {
    try {
      const borrowedBook: BorrowedBook =
        await this.borrowedBooksRepository.findOne({
          where: {
            bookId: bookId,
            returnedAt: IsNull(),
          },
        });

      if (borrowedBook) return true;

      return false;
    } catch (error) {
      throw error;
    }
  }

  async isLimitBookBorrowed(memberId: string): Promise<boolean> {
    try {
      const memberBorrowedBook: BorrowedBook[] =
        await this.borrowedBooksRepository.find({
          where: {
            memberId: memberId,
            returnedAt: IsNull(),
          },
        });

      Logger.log(memberBorrowedBook);

      if (memberBorrowedBook.length == 2) return true;

      return false;
    } catch (error) {
      throw error;
    }
  }
}
