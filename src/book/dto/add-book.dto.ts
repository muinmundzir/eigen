import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString, Length } from 'class-validator';

export class AddBook {
  @ApiProperty({
    description: 'The code of new member',
    example: 'MSD-102',
  })
  @IsNotEmpty({ message: 'Book code is required.' })
  @IsString()
  @Length(5, 7, { message: 'Book code must be 4 characters.' })
  code: string;

  @ApiProperty({
    description: 'The title of new book',
    example: 'Cinderella and Seven Colossi',
  })
  @IsNotEmpty({ message: "Book' title is required." })
  @IsString()
  @Length(3, 100)
  title: string;

  @ApiProperty({
    description: 'The author of new book',
    example: 'John Doe',
  })
  @IsNotEmpty({ message: "Book's author is required." })
  @IsString()
  @Length(3, 20)
  author: string;

  @ApiProperty({
    description: 'The stock of new book',
    example: '2',
  })
  @IsNotEmpty({ message: "Book's stock is required." })
  @IsPositive()
  stock: number;
}
