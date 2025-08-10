import { CreateTransactionUseCase } from './create-transaction.usecase';
import { TransactionRepositoryPort } from '../../domain/ports/transaction.repository.port';
import { MessagingPort } from '../../domain/ports/messaging.port';
import { TransactionTypeEnum } from '../../domain/enums/transaction-type.enum';

// Helpers tipados para mocks
type RepoMock = jest.Mocked<TransactionRepositoryPort>;
type BusMock = jest.Mocked<MessagingPort>;

describe('CreateTransactionUseCase', () => {
  let repo: RepoMock;
  let bus: BusMock;
  let usecase: CreateTransactionUseCase;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    } as unknown as RepoMock;

    bus = {
      publish: jest.fn(),
      subscribe: jest.fn(),
    } as unknown as BusMock;

    usecase = new CreateTransactionUseCase(repo, bus);
  });

  it('crea la transacción y publica el evento transaction.created', async () => {
    // arrange
    const input = {
      accountExternalIdDebit: 'acc-d-1',
      accountExternalIdCredit: 'acc-c-1',
      tranferTypeId: 1,
      value: 1500,
    };

    const now = new Date();
    repo.create.mockResolvedValue({
      id: 'tx-1',
      accountExternalIdDebit: input.accountExternalIdDebit,
      accountExternalIdCredit: input.accountExternalIdCredit,
      transferTypeId: input.tranferTypeId,
      value: input.value,
      status: 'pending',
      type: TransactionTypeEnum.TRANSFER,
      createdAt: now,
    } as any);

    // act
    const result = await usecase.execute(input);

    // assert: se llama al repo con los datos mapeados
    expect(repo.create).toHaveBeenCalledWith({
      accountExternalIdDebit: input.accountExternalIdDebit,
      accountExternalIdCredit: input.accountExternalIdCredit,
      transferTypeId: input.tranferTypeId,
      value: input.value,
      type: TransactionTypeEnum.TRANSFER,
    });

    // assert: se publica el evento
    expect(bus.publish).toHaveBeenCalledTimes(1);
    expect(bus.publish).toHaveBeenCalledWith('transaction.created', {
      transactionId: 'tx-1',
      value: 1500,
    });

    // assert: devuelve la entidad creada
    expect(result.id).toBe('tx-1');
    expect(result.status).toBe('pending');
    expect(result.value).toBe(1500);
  });

  it('propaga el error si el repositorio falla', async () => {
    repo.create.mockRejectedValue(new Error('DB down'));

    await expect(
      usecase.execute({
        accountExternalIdDebit: 'd',
        accountExternalIdCredit: 'c',
        tranferTypeId: 1,
        value: 100,
      }),
    ).rejects.toThrow('DB down');

    expect(bus.publish).not.toHaveBeenCalled();
  });
});
