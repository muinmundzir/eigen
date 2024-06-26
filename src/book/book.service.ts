import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { Book } from './book.entity';
import { AddBook } from './dto/add-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private booksRepository: Repository<Book>,
  ) {}

  async getAllBooks(): Promise<Book[]> {
    try {
      const result = await this.booksRepository.find({
        relations: ['borrowedBooks'],
        where: {
          borrowedBooks: {
            returnedAt: IsNull(),
          },
        },
      });

      // Count book stock
      result.map((data) => {
        const borrowedCount = data.borrowedBooks.length;
        data.stock = +data.stock - borrowedCount;

        delete data.borrowedBooks;

        return data;
      });

      // Return filtered book
      return result.filter((data) => data.stock != 0);
    } catch (error) {
      throw error;
    }
  }

  async addBook(inputDto: AddBook): Promise<Book> {
    try {
      const { code, title, author, stock } = inputDto;

      const book = new Book();
      book.code = code;
      book.title = title;
      book.author = author;
      book.stock = stock;

      return await this.booksRepository.save(book);
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
