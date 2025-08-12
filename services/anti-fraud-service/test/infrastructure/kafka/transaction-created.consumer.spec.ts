import { TransactionCreatedConsumer } from '../../../src/infrastructure/kafka/transaction-created.consumer';
import { MessagingPort } from '../../../src/domain/ports/messaging.port';
import { DecideStatusUseCase } from '../../../src/application/usecases/decide-status.usecase';
import { Topics } from '@app/contracts';

describe('TransactionCreatedConsumer', () => {
  let bus: jest.Mocked<MessagingPort>;
  let decide: DecideStatusUseCase;
  let consumer: TransactionCreatedConsumer;

  let handler!: (payload: any) => Promise<void>;

  beforeEach(() => {
    bus = {
      publish: jest.fn(),
      subscribe: jest.fn(async (_t: string, h: any) => { handler = h; }),
    } as any;

    decide = new DecideStatusUseCase();
    consumer = new TransactionCreatedConsumer(bus, decide);
  });

  it('se suscribe y publica el status (rejected para > 1000)', async () => {
    await consumer.onModuleInit();

    await handler({ transactionId: 'tx-1', value: 1500 });

    expect(bus.publish).toHaveBeenCalledWith(Topics.TransactionStatusUpdated, {
      transactionId: 'tx-1',
      status: 'rejected',
    });
  });

  it('publica approved si value <= 1000', async () => {
    await consumer.onModuleInit();

    await handler({ transactionId: 'tx-2', value: 500 });

    expect(bus.publish).toHaveBeenCalledWith(Topics.TransactionStatusUpdated, {
      transactionId: 'tx-2',
      status: 'approved',
    });
  });
});