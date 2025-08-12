export const Topics = {
  TransactionCreated: "transaction.created",
  TransactionStatusUpdated: "transaction.status.updated",
} as const;

export type TransactionCreated = {
  transactionId: string;
  value: number;
};

export type TransactionStatusUpdated = {
  transactionId: string;
  status: "approved" | "rejected";
};
