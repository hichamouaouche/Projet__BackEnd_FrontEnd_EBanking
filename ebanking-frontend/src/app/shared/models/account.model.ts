import { Customer } from './customer.model';

export type AccountType = 'CurrentAccount' | 'SavingAccount' | 'CA' | 'SA' | string;

interface AccountBase {
  id: string;
  balance: number;
  createdAt: string;
  status: 'CREATED' | 'ACTIVATED' | 'SUSPENDED' | null;
  customerDTO: Customer;
  type: AccountType;
}

export interface CurrentAccount extends AccountBase {
  overDraft: number;
}

export interface SavingAccount extends AccountBase {
  interestRate: number;
}

export type BankAccount = CurrentAccount | SavingAccount;

export const isCurrentAccount = (account: BankAccount): account is CurrentAccount => {
  return account.type === 'CA' || account.type === 'CurrentAccount' || 'overDraft' in account;
};

export const isSavingAccount = (account: BankAccount): account is SavingAccount => {
  return account.type === 'SA' || account.type === 'SavingAccount' || 'interestRate' in account;
};
