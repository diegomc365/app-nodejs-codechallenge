import { SetTransactionStatusUseCase } from '../../../src/application/usecases/set-transaction-status.usecase';
import { TransactionRepositoryPort } from '../../../src/domain/ports/transaction.repository.port';
import { TransactionStatusEnum } from '../../../src/domain/enums/transaction-status.enum';

describe('SetTransactionStatusUseCase', () => {
  let repo: jest.Mocked<TransactionRepositoryPort>;
  let usecase: SetTransactionStatusUseCase;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    } as unknown as jest.Mocked<TransactionRepositoryPort>;

    usecase = new SetTransactionStatusUseCase(repo);
  });

  it('actualiza el estado y devuelve el mismo status', async () => {
    await expect(
      usecase.execute('tx-1', TransactionStatusEnum.REJECTED),
    ).resolves.toBe(TransactionStatusEnum.REJECTED);

    expect(repo.updateStatus).toHaveBeenCalledTimes(1);
    expect(repo.updateStatus).toHaveBeenCalledWith(
      'tx-1',
      TransactionStatusEnum.REJECTED,
    );
  });

  it('propaga errores del repositorio', async () => {
    repo.updateStatus.mockRejectedValue(new Error('db error'));

    await expect(
      usecase.execute('tx-1', TransactionStatusEnum.APPROVED),
    ).rejects.toThrow('db error');
  });
});
