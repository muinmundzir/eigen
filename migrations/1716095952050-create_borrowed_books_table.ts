import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateBorrowedBooksTable1716095952050
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'borrowed_books',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'member_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'book_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'returned_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('borrowed_books', [
      new TableForeignKey({
        columnNames: ['member_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'members',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['book_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'books',
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('borrowed_books');
    const foreignKey1 = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('member_id') !== -1,
    );
    const foreignKey2 = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('book_id') !== -1,
    );

    await queryRunner.dropForeignKeys('borrowed_books', [
      foreignKey1,
      foreignKey2,
    ]);
    await queryRunner.dropTable('borrowed_books');
  }
}
