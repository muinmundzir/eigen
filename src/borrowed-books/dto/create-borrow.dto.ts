import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateBorrow {
  @IsNotEmpty({ message: 'Member ID is required.' })
  @IsUUID()
  memberId: string;

  @IsNotEmpty({ message: 'Book ID is required.' })
  @IsUUID()
  bookId: string;
}
