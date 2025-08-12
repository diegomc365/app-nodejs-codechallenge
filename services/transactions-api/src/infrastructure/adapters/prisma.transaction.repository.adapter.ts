import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionRepositoryPort } from '../../domain/ports/transaction.repository.port';
import { TransactionEntity } from '../../domain/entities/transaction.entity';
import { TransactionStatusEnum } from 'src/domain/enums/transaction-status.enum';

@Injectable()
export class PrismaTransactionRepositoryAdapter
  implements TransactionRepositoryPort
{
  constructor(private readonly prisma: PrismaService) {}

  async create(input: any): Promise<TransactionEntity> {
    const created = await this.prisma.transaction.create({
      data: {
        accountExternalIdDebit: input.accountExternalIdDebit,
        accountExternalIdCredit: input.accountExternalIdCredit,
        transferTypeId: input.transferTypeId,
        value: input.value,
        status: 'pending',
        type: input.type,
      },
    });
    return this.map(created);
  }

  async findById(id: string): Promise<TransactionEntity | null> {
    const tx = await this.prisma.transaction.findUnique({ where: { id } });
    return tx ? this.map(tx) : null;
  }

  async updateStatus(id: string, status: TransactionStatusEnum): Promise<void> {
    console.log('[REPO] updating', id, '->', status); // LOG
    const r = await this.prisma.transaction.update({
      where: { id },
      data: { status },
    });
    console.log('[REPO] updated row status:', r.status); // LOG
  }

  private map(row: any): TransactionEntity {
    return new TransactionEntity(
      row.id,
      row.accountExternalIdDebit,
      row.accountExternalIdCredit,
      row.transferTypeId,
      row.value,
      row.status,
      row.type,
      row.createdAt,
    );
  }
}
