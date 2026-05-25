export type OperationType = 'DEBIT' | 'CREDIT';

export interface AccountOperation {
  id: number;
  operationDate: string;
  amount: number;
  type: OperationType;
  description: string;
}

export interface AccountHistory {
  accountId: string;
  balance: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  accountOperationDTOS: AccountOperation[];
}
