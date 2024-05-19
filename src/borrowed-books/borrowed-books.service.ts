import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { MemberService } from '@app/member/member.service';
import { BorrowedBook } from './borrowed-books.entity';
import { CreateBorrow } from './dto/create-borrow.dto';
import { UpdateBorrow } from './dto/update-borrow.dto';
import { Member } from '@app/member/member.entity';
import { BookService } from '@app/book/book.service';
import { Book } from '@app/book/book.entity';

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
        where: {
          returnedAt: IsNull(),
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async borrowBook(inputDto: CreateBorrow): Promise<BorrowedBook> {
    try {
      const { memberId, bookId } = inputDto;

      const member = await this.findMemberOrFail(memberId);

      const book = await this.findBookOrFail(bookId);

      if (this.isMemberPenalized(member))
        throw new ForbiddenException('Member is penalized for three days.');

      if (await this.isLimitBookBorrowed(memberId))
        throw new ForbiddenException('Borrowed books is limited to two books');

      const validate = await this.isBookBorrowed(bookId);
      if (validate.status)
        throw new ForbiddenException(
          'Book is already borrowed by other member',
        );

      const data = new BorrowedBook();
      data.memberId = member.id;
      data.bookId = book.id;

      return await this.borrowedBooksRepository.save(data);
    } catch (error) {
      throw error;
    }
  }

  async returnBook(inputDto: UpdateBorrow): Promise<BorrowedBook> {
    try {
      const { memberId, bookId } = inputDto;

      const member = await this.findMemberOrFail(memberId);

      const book = await this.findBookOrFail(bookId);

      const borrowedBook = await this.borrowedBooksRepository.findOne({
        where: {
          memberId: member.id,
          bookId: book.id,
          returnedAt: IsNull(),
        },
      });

      if (!borrowedBook)
        throw new NotFoundException('Borrowed book data not found.');

      if (await this.isPenalizeable(borrowedBook))
        await this.membersService.penalizeMember(memberId);

      borrowedBook.returnedAt = new Date();

      return await this.borrowedBooksRepository.save(borrowedBook);
    } catch (error) {
      throw error;
    }
  }

  private async findMemberOrFail(memberId: string): Promise<Member> {
    const member = await this.membersService.findMember(memberId);

    if (!member) throw new NotFoundException('Member not found.');

    return member;
  }

  private async findBookOrFail(bookId: string): Promise<Book> {
    const book = await this.booksService.findBook(bookId);

    if (!book) throw new NotFoundException('Book not found.');

    return book;
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

    Logger.log('beda hari:', differenceInDays > 7);
    return differenceInDays > 7;
  }

  async isBookBorrowed(
    bookId: string,
  ): Promise<{ status: boolean; data?: BorrowedBook }> {
    try {
      const borrowedBook: BorrowedBook =
        await this.borrowedBooksRepository.findOne({
          relations: ['book'],
          where: {
            bookId: bookId,
            returnedAt: IsNull(),
          },
        });

      if (borrowedBook && borrowedBook.book.stock == 1) return { status: true };

      return { status: false, data: borrowedBook };
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

  isMemberPenalized(member: Member) {
    if (this.isPassThreeDaysAfterPenalized(member.penalizedAt)) return false;

    return true;
  }

  isPassThreeDaysAfterPenalized(timestamp: Date) {
    const currentDate = new Date();
    const timestampDate = new Date(timestamp);

    // Calculate the difference in milliseconds
    const differenceInMilliseconds =
      currentDate.getTime() - timestampDate.getTime();

    // Convert difference to days
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

    return differenceInDays > 3;
  }
}
