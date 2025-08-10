export class TransactionEntity {
  constructor(
    public readonly id: string,
    public readonly accountExternalIdDebit: string,
    public readonly accountExternalIdCredit: string,
    public readonly transferTypeId: number,
    public readonly value: number,
    public status: 'pending' | 'approved' | 'rejected',
    public readonly type: 'transfer' | 'payment' | 'cashout',
    public readonly createdAt: Date,
  ) {}
}
