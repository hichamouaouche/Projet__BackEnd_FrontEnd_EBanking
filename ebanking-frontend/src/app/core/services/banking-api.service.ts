import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Customer } from '../../shared/models/customer.model';
import { AccountHistory, AccountOperation } from '../../shared/models/operation.model';
import { BankAccount } from '../../shared/models/account.model';

@Injectable({ providedIn: 'root' })
export class BankingApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  listCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.baseUrl}/customers`);
  }

  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/customers/${id}`);
  }

  createCustomer(payload: Omit<Customer, 'id'>): Observable<Customer> {
    return this.http.post<Customer>(`${this.baseUrl}/customers`, payload);
  }

  updateCustomer(id: number, payload: Omit<Customer, 'id'>): Observable<Customer> {
    return this.http.put<Customer>(`${this.baseUrl}/customers/${id}`, payload);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/customers/${id}`);
  }

  listAccounts(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(`${this.baseUrl}/accounts`);
  }

  getAccount(accountId: string): Observable<BankAccount> {
    return this.http.get<BankAccount>(`${this.baseUrl}/accounts/${accountId}`);
  }

  accountOperations(accountId: string): Observable<AccountOperation[]> {
    return this.http.get<AccountOperation[]>(`${this.baseUrl}/accounts/${accountId}/operations`);
  }

  accountHistory(accountId: string, page: number, size: number): Observable<AccountHistory> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<AccountHistory>(`${this.baseUrl}/accounts/${accountId}/pageoperations`, { params });
  }
}
