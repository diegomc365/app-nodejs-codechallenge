import { Test } from '@nestjs/testing';
import { TransactionResolver } from './transaction.resolver';
import { CreateTransactionUseCase } from '../../application/usecases/create-transaction.usecase';
import { GetTransactionUseCase } from '../../application/usecases/get-transaction.usecase';
import { UpdateTransactionStatusUseCase } from '../../application/usecases/update-transaction-status.usecase';

describe('TransactionResolver', () => {
  let resolver: TransactionResolver;

  const createUC = { execute: jest.fn() };
  const getUC = { execute: jest.fn() };
  const updateUC = { execute: jest.fn() };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TransactionResolver,
        { provide: CreateTransactionUseCase, useValue: createUC },
        { provide: GetTransactionUseCase, useValue: getUC },
        { provide: UpdateTransactionStatusUseCase, useValue: updateUC },
      ],
    }).compile();

    resolver = moduleRef.get(TransactionResolver);
  });

  beforeEach(() => jest.clearAllMocks());

  it('createTransaction delega al use case y mapea al DTO GraphQL', async () => {
    // El UC devuelve la ENTIDAD (status y type planos)
    createUC.execute.mockResolvedValue({
      id: 'tx-1',
      accountExternalIdDebit: 'd',
      accountExternalIdCredit: 'c',
      transferTypeId: 1,
      value: 120,
      status: 'pending',
      type: 'transfer',
      createdAt: new Date(),
    });

    const res = await resolver.createTransaction({
      accountExternalIdDebit: 'd',
      accountExternalIdCredit: 'c',
      tranferTypeId: 1,
      value: 120,
    });

    expect(createUC.execute).toHaveBeenCalled();
    expect(res.id).toBe('tx-1');
    expect(res.transactionStatus.name).toBe('pending'); // ✅ nested
    expect(res.transactionType.name).toBe('transfer'); // ✅ nested
  });

  it('transaction delega al use case y mapea status/type a nested fields', async () => {
    getUC.execute.mockResolvedValue({
      id: 'tx-1',
      accountExternalIdDebit: 'd',
      accountExternalIdCredit: 'c',
      transferTypeId: 1,
      value: 1500,
      status: 'rejected', // 👈 entidad
      type: 'transfer',
      createdAt: new Date(),
    });

    const res = await resolver.transaction('tx-1');

    expect(getUC.execute).toHaveBeenCalledWith('tx-1');
    expect(res.transactionStatus.name).toBe('rejected'); // ✅ viene del map()
    expect(res.transactionType.name).toBe('transfer');
  });
});
