import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { KafkaModule } from './infrastructure/kafka/kafka.module';
import { TransactionResolver } from './infrastructure/graphql/transaction.resolver';
import { CreateTransactionUseCase } from './application/usecases/create-transaction.usecase';
import { GetTransactionUseCase } from './application/usecases/get-transaction.usecase';
import { UpdateTransactionStatusUseCase } from './application/usecases/update-transaction-status.usecase';
import { TransactionRepositoryPort } from './domain/ports/transaction.repository.port';
import { PrismaTransactionRepositoryAdapter } from './infrastructure/adapters/prisma.transaction.repository.adapter';
import { MessagingPort } from './domain/ports/messaging.port';
import { KafkaMessagingAdapter } from './infrastructure/adapters/kafka.messaging.adapter';
import { TransactionStatusConsumer } from './infrastructure/kafka/transaction-status.consumer';
import { SetTransactionStatusUseCase } from './application/usecases/set-transaction-status.usecase';

@Module({
  imports: [PrismaModule, KafkaModule],
  providers: [
    TransactionResolver,
    CreateTransactionUseCase,
    GetTransactionUseCase,
    UpdateTransactionStatusUseCase,
    SetTransactionStatusUseCase,
    TransactionStatusConsumer,
    {
      provide: TransactionRepositoryPort,
      useClass: PrismaTransactionRepositoryAdapter,
    },
    { provide: MessagingPort, useExisting: KafkaMessagingAdapter },
  ],
})
export class TransactionsModule {}
