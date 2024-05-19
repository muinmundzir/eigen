import { Book } from '@app/book/book.entity';
import { Member } from '@app/member/member.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'borrowed_books' })
export class BorrowedBook {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'uuid', name: 'member_id' })
  memberId: string;

  @Column({ type: 'uuid', name: 'book_id' })
  bookId: string;

  @ManyToOne(() => Member, (member) => member.borrowedBooks, {
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @ManyToOne(() => Book, (book) => book.borrowedBooks, {
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @Column({
    name: 'returned_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  returnedAt: Date;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
