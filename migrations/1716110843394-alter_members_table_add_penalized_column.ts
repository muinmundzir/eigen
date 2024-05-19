import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterMembersTableAddPenalizedColumn1716110843394
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'members',
      new TableColumn({
        name: 'penalized_at',
        type: 'timestamp',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('members', 'penalized_at');
  }
}
