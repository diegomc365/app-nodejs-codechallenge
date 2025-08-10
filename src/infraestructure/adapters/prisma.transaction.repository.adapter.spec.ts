import { PrismaTransactionRepositoryAdapter } from './prisma.transaction.repository.adapter';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionStatusEnum } from '../../domain/enums/transaction-status.enum';

describe('PrismaTransactionRepositoryAdapter', () => {
  let prisma: any;
  let repo: PrismaTransactionRepositoryAdapter;

  beforeEach(() => {
    prisma = {
      transaction: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    } as any;
    repo = new PrismaTransactionRepositoryAdapter(prisma);
  });

  it('create: mapea y devuelve TransactionEntity', async () => {
    const row = {
      id: 'tx-1',
      accountExternalIdDebit: 'd',
      accountExternalIdCredit: 'c',
      transferTypeId: 1,
      value: 120,
      status: 'pending',
      type: 'transfer',
      createdAt: new Date(),
    };
    prisma.transaction.create.mockResolvedValue(row as any);

    const entity = await repo.create({
      accountExternalIdDebit: 'd',
      accountExternalIdCredit: 'c',
      transferTypeId: 1,
      value: 120,
      type: 'transfer',
    });

    expect(prisma.transaction.create).toHaveBeenCalled();
    expect(entity.id).toBe('tx-1');
    expect(entity.status).toBe('pending');
  });

  it('findById: retorna entidad cuando existe', async () => {
    const row = { id: 'tx-2', createdAt: new Date() } as any;
    prisma.transaction.findUnique.mockResolvedValue(row);

    const entity = await repo.findById('tx-2');
    expect(prisma.transaction.findUnique).toHaveBeenCalledWith({
      where: { id: 'tx-2' },
    });
    expect(entity?.id).toBe('tx-2');
  });

  it('findById: retorna null cuando no existe', async () => {
    prisma.transaction.findUnique.mockResolvedValue(null);
    const entity = await repo.findById('nope');
    expect(entity).toBeNull();
  });

  it('updateStatus: llama a prisma.update con el enum correcto', async () => {
    prisma.transaction.update.mockResolvedValue({ status: 'approved' } as any);

    await repo.updateStatus('tx-3', TransactionStatusEnum.APPROVED);

    expect(prisma.transaction.update).toHaveBeenCalledWith({
      where: { id: 'tx-3' },
      data: { status: TransactionStatusEnum.APPROVED },
    });
  });
});
