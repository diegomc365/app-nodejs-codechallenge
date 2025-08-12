import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { MessagingPort } from '../../domain/ports/messaging.port';
import { Topics } from '@app/contracts';
import { DecideStatusUseCase } from '../../application/usecases/decide-status.usecase';

@Injectable()
export class TransactionCreatedConsumer implements OnModuleInit {
  constructor(
    @Inject(MessagingPort) private readonly bus: MessagingPort, // <-- inyección explícita
    private readonly decide: DecideStatusUseCase,
  ) {}

  async onModuleInit() {
    await this.bus.subscribe(Topics.TransactionCreated, async (payload) => {
      const status = this.decide.execute(payload.value);
      await this.bus.publish(Topics.TransactionStatusUpdated, {
        transactionId: payload.transactionId,
        status,
      });
    });
  }
}