import { TransactionEntity } from './transaction.entity';

describe('TransactionEntity', () => {
  it('debe crear una instancia con todos los valores correctamente asignados', () => {
    const now = new Date();
    const entity = new TransactionEntity(
      'tx-123',
      'debit-acc',
      'credit-acc',
      1,
      500,
      'pending',
      'transfer',
      now,
    );

    expect(entity.id).toBe('tx-123');
    expect(entity.accountExternalIdDebit).toBe('debit-acc');
    expect(entity.accountExternalIdCredit).toBe('credit-acc');
    expect(entity.transferTypeId).toBe(1);
    expect(entity.value).toBe(500);
    expect(entity.status).toBe('pending');
    expect(entity.type).toBe('transfer');
    expect(entity.createdAt).toBe(now);
  });

  it('permite actualizar el status después de ser creado', () => {
    const entity = new TransactionEntity(
      'tx-456',
      'debit-x',
      'credit-y',
      2,
      1000,
      'pending',
      'payment',
      new Date(),
    );

    entity.status = 'approved';
    expect(entity.status).toBe('approved');
  });
});
