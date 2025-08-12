import { Injectable } from '@nestjs/common';
import { TransactionRepositoryPort } from '../../domain/ports/transaction.repository.port';
import { TransactionStatusEnum } from '../../domain/enums/transaction-status.enum';

@Injectable()
export class SetTransactionStatusUseCase {
  constructor(private readonly repo: TransactionRepositoryPort) {}

  async execute(id: string, status: TransactionStatusEnum) {
    await this.repo.updateStatus(id, status);
    return status;
  }
}
