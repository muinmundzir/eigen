import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { MemberService } from '@app/member/member.service';
import { BookService } from '@app/book/book.service';
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
    private membersService: MemberService,
    private booksService: BookService,
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

      const member = await this.membersService.findMember(memberId);
      if (!member) throw new NotFoundException('Member data not found.');

      const book = await this.booksService.findBook(bookId);
      if (!book) throw new NotFoundException('Book data not found.');

      // check if member already borrowed two books
      if (await this.isLimitBookBorrowed(member))
        throw new ForbiddenException('Borrowed books is limited to two books');

      // check if book is already borrowed
      if (await this.isBookBorrowed(book))
        throw new ForbiddenException(
          'Book is already borrowed by other member',
        );

      const data = new BorrowedBook();
      data.memberId = member.id;
      data.bookId = book.id;

      return this.borrowedBooksRepository.save(data);
    } catch (error) {
      throw error;
    }
  }

  async returnBook(inputDto: UpdateBorrow): Promise<BorrowedBook> {
    try {
      const { memberId, bookId } = inputDto;

      const member = await this.membersService.findMember(memberId);
      if (!member) throw new NotFoundException('Member data not found.');

      const book = await this.booksService.findBook(bookId);
      if (!book) throw new NotFoundException('Book data not found.');

      const borrowedBook = await this.borrowedBooksRepository.findOne({
        where: {
          memberId: member.id,
          bookId: book.id,
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

  async isBookBorrowed(book: Book): Promise<boolean> {
    try {
      const borrowedBook: BorrowedBook =
        await this.borrowedBooksRepository.findOne({
          where: {
            bookId: book.id,
            returnedAt: IsNull(),
          },
        });

      if (borrowedBook) return true;

      return false;
    } catch (error) {
      throw error;
    }
  }

  async isLimitBookBorrowed(member: Member): Promise<boolean> {
    try {
      const memberBorrowedBook: BorrowedBook[] =
        await this.borrowedBooksRepository.find({
          where: {
            memberId: member.id,
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
