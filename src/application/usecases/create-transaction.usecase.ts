import { Injectable } from '@nestjs/common';
import { TransactionRepositoryPort } from '../../domain/ports/transaction.repository.port';
import { MessagingPort } from '../../domain/ports/messaging.port';
import { TransactionEntity } from '../../domain/entities/transaction.entity';
import { TransactionTypeEnum } from '../../domain/enums/transaction-type.enum';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    private readonly repo: TransactionRepositoryPort,
    private readonly bus: MessagingPort,
  ) {}

  async execute(input: {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: number; // sic
    value: number;
  }): Promise<TransactionEntity> {
    const entity = await this.repo.create({
      accountExternalIdDebit: input.accountExternalIdDebit,
      accountExternalIdCredit: input.accountExternalIdCredit,
      transferTypeId: input.tranferTypeId,
      value: input.value,
      type: TransactionTypeEnum.TRANSFER,
    });

    await this.bus.publish('transaction.created', {
      transactionId: entity.id,
      value: entity.value,
    });

    return entity;
  }
}
