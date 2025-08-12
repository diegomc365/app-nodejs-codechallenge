import { GetTransactionUseCase } from '../../../src/application/usecases/get-transaction.usecase';
import { TransactionRepositoryPort } from '../../../src/domain/ports/transaction.repository.port';
import { NotFoundException } from '@nestjs/common';

describe('GetTransactionUseCase', () => {
  let repo: jest.Mocked<TransactionRepositoryPort>;
  let usecase: GetTransactionUseCase;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    } as unknown as jest.Mocked<TransactionRepositoryPort>;

    usecase = new GetTransactionUseCase(repo);
  });

  it('devuelve la transacción cuando existe', async () => {
    const tx = {
      id: 'tx-1',
      value: 120,
      status: 'approved',
      accountExternalIdDebit: 'd',
      accountExternalIdCredit: 'c',
      transferTypeId: 1,
      type: 'transfer',
      createdAt: new Date(),
    } as any;

    repo.findById.mockResolvedValue(tx);

    const result = await usecase.execute('tx-1');

    expect(repo.findById).toHaveBeenCalledWith('tx-1');
    expect(result).toBe(tx);
  });

  it('lanza NotFoundException si no existe', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(usecase.execute('nope')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(repo.findById).toHaveBeenCalledWith('nope');
  });
});
