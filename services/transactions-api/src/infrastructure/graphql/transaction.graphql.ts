import {
  Field,
  ID,
  Int,
  ObjectType,
  registerEnumType,
  InputType,
} from '@nestjs/graphql';
import { TransactionStatusEnum } from '../../domain/enums/transaction-status.enum';
import { TransactionTypeEnum } from '../../domain/enums/transaction-type.enum';

registerEnumType(TransactionStatusEnum, { name: 'TransactionStatus' });
registerEnumType(TransactionTypeEnum, { name: 'TransactionType' });

@ObjectType()
export class TransactionTypeGql {
  @Field(() => String) name!: string;
}

@ObjectType()
export class TransactionStatusGql {
  @Field(() => String) name!: string;
}

@ObjectType()
export class Transaction {
  @Field(() => ID) id!: string;
  @Field(() => String) accountExternalIdDebit!: string;
  @Field(() => String) accountExternalIdCredit!: string;
  @Field(() => Int) transferTypeId!: number;
  @Field(() => Int) value!: number;
  @Field(() => TransactionTypeGql) transactionType!: TransactionTypeGql;
  @Field(() => TransactionStatusGql) transactionStatus!: TransactionStatusGql;
  @Field(() => Date) createdAt!: Date;
}

@InputType()
export class CreateTransactionInput {
  @Field(() => String) accountExternalIdDebit!: string;
  @Field(() => String) accountExternalIdCredit!: string;
  @Field(() => Int) tranferTypeId!: number; // sic
  @Field(() => Int) value!: number;
}
