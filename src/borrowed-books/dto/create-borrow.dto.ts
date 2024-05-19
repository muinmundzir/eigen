import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateBorrow {
  @ApiProperty({
    description: 'The ID of the member',
    example: '7a8e4774-874e-49a5-a859-6147f81081e5',
  })
  @IsNotEmpty({ message: 'Member ID is required.' })
  @IsUUID()
  memberId: string;

  @ApiProperty({
    description: 'The ID of the book',
    example: '815cafdd-748f-4a07-bf6a-a9fd315e597c',
  })
  @IsNotEmpty({ message: 'Book ID is required.' })
  @IsUUID()
  bookId: string;
}
