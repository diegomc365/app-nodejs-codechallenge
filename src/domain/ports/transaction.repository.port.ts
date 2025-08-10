import { TransactionEntity } from '../entities/transaction.entity';
import { TransactionStatusEnum } from '../enums/transaction-status.enum';

export abstract class TransactionRepositoryPort {
  abstract create(input: {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transferTypeId: number;
    value: number;
    type: string;
  }): Promise<TransactionEntity>;

  abstract findById(id: string): Promise<TransactionEntity | null>;

  abstract updateStatus(
    id: string,
    status: TransactionStatusEnum,
  ): Promise<void>;
}
