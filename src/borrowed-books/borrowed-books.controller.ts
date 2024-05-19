import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { BorrowedBooksService } from './borrowed-books.service';
import { BorrowedBook } from './borrowed-books.entity';
import { CreateBorrow } from './dto/create-borrow.dto';
import { UpdateBorrow } from './dto/update-borrow.dto';

@Controller('borrowed-books')
export class BorrowedBooksController {
  constructor(private borrowedBookService: BorrowedBooksService) {}

  @Get('/')
  async getBorrowedBooks(): Promise<BorrowedBook[]> {
    return this.borrowedBookService.getAllBorrowedBooks();
  }

  @Post('/')
  async borrowBook(@Body() borrowsData: CreateBorrow): Promise<BorrowedBook> {
    return this.borrowedBookService.borrowBook(borrowsData);
  }

  @Patch('/')
  async returnBook(@Body() borrowsData: UpdateBorrow): Promise<BorrowedBook> {
    return this.borrowedBookService.returnBook(borrowsData);
  }
}
