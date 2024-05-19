import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { BookService } from './book.service';

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
}
