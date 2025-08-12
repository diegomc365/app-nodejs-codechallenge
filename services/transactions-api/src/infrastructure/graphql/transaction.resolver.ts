import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateTransactionUseCase } from '../../application/usecases/create-transaction.usecase';
import { GetTransactionUseCase } from '../../application/usecases/get-transaction.usecase';
import { UpdateTransactionStatusUseCase } from '../../application/usecases/update-transaction-status.usecase';
import { CreateTransactionInput, Transaction } from './transaction.graphql';

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(
    private readonly createTx: CreateTransactionUseCase,
    private readonly getTx: GetTransactionUseCase,
    private readonly updateStatus: UpdateTransactionStatusUseCase,
  ) {}

  @Mutation(() => Transaction)
  async createTransaction(
    @Args('input') input: CreateTransactionInput,
  ): Promise<Transaction> {
    const created = await this.createTx.execute(input);
    return this.map(created);
  }

  @Query(() => Transaction)
  async transaction(@Args('id') id: string): Promise<Transaction> {
    const tx = await this.getTx.execute(id);
    return this.map(tx);
  }

  @Mutation(() => String)
  async simulateStatus(@Args('id') id: string, @Args('value') value: number) {
    return this.updateStatus.execute(id, value);
  }

  private map(e: any): Transaction {
    return {
      id: e.id,
      accountExternalIdDebit: e.accountExternalIdDebit,
      accountExternalIdCredit: e.accountExternalIdCredit,
      transferTypeId: e.transferTypeId,
      value: e.value,
      transactionType: { name: e.type },
      transactionStatus: { name: e.status },
      createdAt: e.createdAt,
    } as Transaction;
  }
}
