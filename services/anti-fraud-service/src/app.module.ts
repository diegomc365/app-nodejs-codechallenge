import { Module } from "@nestjs/common";
import { KafkaModule } from "./infrastructure/kafka/kafka.module";
import { TransactionCreatedConsumer } from "./infrastructure/kafka/transaction-created.consumer";
import { DecideStatusUseCase } from "./application/usecases/decide-status.usecase";
import { MessagingPort } from "./domain/ports/messaging.port";
import { KafkaMessagingAdapter } from "./infrastructure/adapters/kafka.messaging.adapter";

@Module({
  imports: [KafkaModule],
  providers: [
    DecideStatusUseCase,
    TransactionCreatedConsumer,
    { provide: MessagingPort, useExisting: KafkaMessagingAdapter },
  ],
})
export class AppModule {}
