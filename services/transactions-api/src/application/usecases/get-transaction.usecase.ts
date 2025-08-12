import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionRepositoryPort } from '../../domain/ports/transaction.repository.port';

@Injectable()
export class GetTransactionUseCase {
  constructor(private readonly repo: TransactionRepositoryPort) {}

  async execute(id: string) {
    const tx = await this.repo.findById(id);
    if (!tx) throw new NotFoundException('Transaction not found');
    return tx;
  }
}
