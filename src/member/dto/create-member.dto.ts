import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateMember {
  @ApiProperty({
    description: 'The code of new member',
    example: 'M003',
  })
  @IsNotEmpty({ message: 'Member ID is required.' })
  @IsString()
  @Length(4, 4, { message: 'Code member must be 4 characters.' })
  code: string;

  @ApiProperty({
    description: 'The name of new member',
    example: 'John Doe',
  })
  @IsNotEmpty({ message: 'Book ID is required.' })
  @IsString()
  @Length(3, 20)
  name: string;
}
