import { TransactionStatusConsumer } from '../../../src/infrastructure/kafka/transaction-status.consumer';
import { MessagingPort } from '../../../src/domain/ports/messaging.port';
import { SetTransactionStatusUseCase } from '../../../src/application/usecases/set-transaction-status.usecase';
import { TransactionStatusEnum } from '../../../src/domain/enums/transaction-status.enum';

describe('TransactionStatusConsumer', () => {
  let bus: jest.Mocked<MessagingPort>;
  let setStatus: jest.Mocked<SetTransactionStatusUseCase>;
  let consumer: TransactionStatusConsumer;

  beforeEach(() => {
    bus = {
      publish: jest.fn(),
      subscribe: jest.fn(),
    } as any;

    setStatus = {
      execute: jest.fn(),
    } as any;

    consumer = new TransactionStatusConsumer(bus, setStatus);
  });

  it('se suscribe y actualiza el status cuando llega el evento', async () => {
    // capturamos el handler que el consumer registra
    let handler!: (payload: any) => Promise<void>;
    bus.subscribe.mockImplementation(async (_topic, h) => {
      handler = h;
    });

    await consumer.onModuleInit();

    // simulamos llegada de mensaje
    await handler({ transactionId: 'tx-1', status: 'rejected' });

    expect(setStatus.execute).toHaveBeenCalledWith(
      'tx-1',
      TransactionStatusEnum.REJECTED,
    );
  });

  it('ignora payload inválido', async () => {
    let handler!: (payload: any) => Promise<void>;
    bus.subscribe.mockImplementation(async (_topic, h) => {
      handler = h;
    });

    await consumer.onModuleInit();

    await handler({}); // sin id/status
    expect(setStatus.execute).not.toHaveBeenCalled();
  });
});
