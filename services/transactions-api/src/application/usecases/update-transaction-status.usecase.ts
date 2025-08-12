import { Injectable } from '@nestjs/common';
import { TransactionRepositoryPort } from '../../domain/ports/transaction.repository.port';
import { TransactionStatusEnum } from '../../domain/enums/transaction-status.enum';

@Injectable()
export class UpdateTransactionStatusUseCase {
  constructor(private readonly repo: TransactionRepositoryPort) {}

  async execute(id: string, value: number) {
    const status =
      value > 1000
        ? TransactionStatusEnum.REJECTED
        : TransactionStatusEnum.APPROVED;
    await this.repo.updateStatus(id, status);
    return status;
  }
}
