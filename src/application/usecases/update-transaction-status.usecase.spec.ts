import { UpdateTransactionStatusUseCase } from './update-transaction-status.usecase';
import { TransactionRepositoryPort } from '../../domain/ports/transaction.repository.port';
import { TransactionStatusEnum } from '../../domain/enums/transaction-status.enum';

describe('UpdateTransactionStatusUseCase', () => {
  let repo: jest.Mocked<TransactionRepositoryPort>;
  let usecase: UpdateTransactionStatusUseCase;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    } as unknown as jest.Mocked<TransactionRepositoryPort>;

    usecase = new UpdateTransactionStatusUseCase(repo);
    jest.clearAllMocks();
  });

  it.each([
    { value: 1500, expected: TransactionStatusEnum.REJECTED },
    { value: 1000, expected: TransactionStatusEnum.APPROVED },
    { value: 120, expected: TransactionStatusEnum.APPROVED },
  ])(
    'con value=$value devuelve $expected y actualiza el repo',
    async ({ value, expected }) => {
      const id = 'tx-1';

      const result = await usecase.execute(id, value);

      expect(result).toBe(expected);
      expect(repo.updateStatus).toHaveBeenCalledTimes(1);
      expect(repo.updateStatus).toHaveBeenCalledWith(id, expected);
    },
  );

  it('propaga errores del repositorio', async () => {
    repo.updateStatus.mockRejectedValue(new Error('db error'));

    await expect(usecase.execute('tx-2', 300)).rejects.toThrow('db error');
  });
});
