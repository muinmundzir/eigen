import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { MemberService } from '@app/member/member.service';
import { BorrowedBook } from './borrowed-books.entity';
import { CreateBorrow } from './dto/create-borrow.dto';
import { UpdateBorrow } from './dto/update-borrow.dto';

@Injectable()
export class BorrowedBooksService {
  constructor(
    @InjectRepository(BorrowedBook)
    private borrowedBooksRepository: Repository<BorrowedBook>,
    private membersService: MemberService,
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

      // Check if user will be penalized
      if (this.isPenalizeable(borrowedBook))
        await this.membersService.penalizeMember(memberId);

      borrowedBook.returnedAt = new Date();

      return await this.borrowedBooksRepository.save(borrowedBook);
    } catch (error) {
      throw error;
    }
  }

  async isPenalizeable(borrowedBook: BorrowedBook): Promise<boolean> {
    try {
      if (this.isSevenDaysAfter(borrowedBook.createdAt)) return true;

      return false;
    } catch (error) {
      throw error;
    }
  }

  isSevenDaysAfter(timestamp: Date) {
    const currentDate = new Date();
    const timestampDate = new Date(timestamp);

    // Calculate the difference in milliseconds
    const differenceInMilliseconds =
      currentDate.getTime() - timestampDate.getTime();

    // Convert difference to days
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

    return differenceInDays > 7;
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

      if (memberBorrowedBook.length == 2) return true;

      return false;
    } catch (error) {
      throw error;
    }
  }
}
