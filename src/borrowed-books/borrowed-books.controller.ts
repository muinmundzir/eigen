import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Patch,
  Post,
} from '@nestjs/common';

import { MemberService } from '@app/member/member.service';
import { BookService } from '@app/book/book.service';
import { BorrowedBooksService } from './borrowed-books.service';
import { BorrowedBook } from './borrowed-books.entity';
import { CreateBorrow } from './dto/create-borrow.dto';
import { UpdateBorrow } from './dto/update-borrow.dto';
import { Member } from '@app/member/member.entity';

@Controller('borrowed-books')
export class BorrowedBooksController {
  constructor(
    private borrowedBookService: BorrowedBooksService,
    private membersService: MemberService,
    private booksService: BookService,
  ) {}

  @Get('/')
  async getBorrowedBooks(): Promise<BorrowedBook[]> {
    return this.borrowedBookService.getAllBorrowedBooks();
  }

  @Post('/')
  async borrowBook(@Body() borrowsData: CreateBorrow): Promise<BorrowedBook> {
    if (this.isDataValid(borrowsData))
      return this.borrowedBookService.borrowBook(borrowsData);
  }

  @Patch('/')
  async returnBook(@Body() borrowsData: UpdateBorrow): Promise<BorrowedBook> {
    if (this.isDataValid(borrowsData))
      return this.borrowedBookService.returnBook(borrowsData);
  }

  // validation
  async isDataValid(data: {
    memberId: string;
    bookId: string;
  }): Promise<boolean> {
    const member = await this.membersService.findMember(data.memberId);
    if (!member) throw new NotFoundException('Member data not found.');

    if (!this.isMemberPenalized(member))
      throw new ForbiddenException('Member is penalized for three days');

    const book = await this.booksService.findBook(data.bookId);
    if (!book) throw new NotFoundException('Book data not found.');

    return true;
  }

  isMemberPenalized(member: Member) {
    if (
      member.penalizedAt &&
      this.isPassThreeDaysAfterPenalized(member.penalizedAt)
    )
      return false;

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
