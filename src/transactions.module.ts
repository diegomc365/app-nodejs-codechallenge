import { Module } from '@nestjs/common';
import { PrismaModule } from './infraestructure/prisma/prisma.module';
import { KafkaModule } from './infraestructure/kafka/kafka.module';
import { TransactionResolver } from './infraestructure/graphql/transaction.resolver';
import { CreateTransactionUseCase } from './application/usecases/create-transaction.usecase';
import { GetTransactionUseCase } from './application/usecases/get-transaction.usecase';
import { UpdateTransactionStatusUseCase } from './application/usecases/update-transaction-status.usecase';
import { TransactionRepositoryPort } from './domain/ports/transaction.repository.port';
import { PrismaTransactionRepositoryAdapter } from './infraestructure/adapters/prisma.transaction.repository.adapter';
import { MessagingPort } from './domain/ports/messaging.port';
import { KafkaMessagingAdapter } from './infraestructure/adapters/kafka.messaging.adapter';
import { TransactionStatusConsumer } from './infraestructure/kafka/transaction-status.consumer';
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
