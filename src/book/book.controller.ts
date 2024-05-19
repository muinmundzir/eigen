import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';

import { BookService } from './book.service';
import { AddBook } from './dto/add-book.dto';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get('/')
  @ApiOkResponse({
    description: 'Return list books.',
  })
  getBooks() {
    return this.bookService.getAllBooks();
  }

  @Post('/')
  @ApiOkResponse({
    description: 'Add new book.',
  })
  @ApiBadRequestResponse({
    description: 'Fail to add book.',
  })
  createMember(@Body() bookData: AddBook) {
    return this.bookService.addBook(bookData);
  }
}
