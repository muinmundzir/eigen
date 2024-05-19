import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Book } from './book.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private booksRepository: Repository<Book>,
  ) {}

  async getAllBooks(): Promise<Book[]> {
    try {
      return await this.booksRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async findBook(id: string): Promise<Book> {
    try {
      return await this.booksRepository.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
