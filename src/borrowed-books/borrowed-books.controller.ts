import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { BorrowedBooksService } from './borrowed-books.service';
import { BorrowedBook } from './borrowed-books.entity';
import { CreateBorrow } from './dto/create-borrow.dto';
import { UpdateBorrow } from './dto/update-borrow.dto';

@Controller('borrowed-books')
export class BorrowedBooksController {
  constructor(private borrowedBookService: BorrowedBooksService) {}

  @Get('/')
  @ApiOkResponse({
    description: 'Return list of borrowed books and member who borrowed it.',
  })
  async getBorrowedBooks(): Promise<BorrowedBook[]> {
    return this.borrowedBookService.getAllBorrowedBooks();
  }

  @Post('/')
  @ApiCreatedResponse({
    description: 'Success borrowing a book.',
  })
  @ApiBadRequestResponse({
    description: 'Request failed.',
  })
  @ApiNotFoundResponse({
    description: 'Either member or book cannot be found.',
  })
  @ApiForbiddenResponse({
    description:
      'Member is penalized OR book is borrowed by other member OR member already borrowed two books',
  })
  async borrowBook(@Body() borrowsData: CreateBorrow): Promise<BorrowedBook> {
    return this.borrowedBookService.borrowBook(borrowsData);
  }

  @Patch('/')
  @ApiOkResponse({
    description: 'Success returning a book.',
  })
  @ApiBadRequestResponse({
    description: 'Request failed',
  })
  @ApiNotFoundResponse({
    description: 'Either member or book cannot be found.',
  })
  async returnBook(@Body() borrowsData: UpdateBorrow): Promise<BorrowedBook> {
    return this.borrowedBookService.returnBook(borrowsData);
  }
}
