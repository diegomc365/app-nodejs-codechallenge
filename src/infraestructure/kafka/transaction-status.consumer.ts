// src/infrastructure/kafka/transaction-status.consumer.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { MessagingPort } from '../../domain/ports/messaging.port';
import { SetTransactionStatusUseCase } from '../../application/usecases/set-transaction-status.usecase';
import { TransactionStatusEnum } from '../../domain/enums/transaction-status.enum';

@Injectable()
export class TransactionStatusConsumer implements OnModuleInit {
  constructor(
    private readonly bus: MessagingPort,
    private readonly setStatus: SetTransactionStatusUseCase,
  ) {}

  async onModuleInit() {
    await this.bus.subscribe('transaction.status.updated', async (payload) => {
      console.log('[CONSUMER] status.updated payload:', payload); // LOG
      const { transactionId, status } = payload || {};
      if (!transactionId || !status) {
        console.warn('[CONSUMER] invalid payload', payload); // LOG
        return;
      }
      try {
        await this.setStatus.execute(
          transactionId,
          status as TransactionStatusEnum,
        );
        console.log('[CONSUMER] updated OK:', transactionId, status); // LOG
      } catch (e) {
        console.error('[CONSUMER] update failed:', e); // LOG
      }
    });
  }
}
