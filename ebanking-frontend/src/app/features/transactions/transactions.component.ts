import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BankingApiService } from '../../core/services/banking-api.service';
import { AccountOperation } from '../../shared/models/operation.model';
import { BankAccount } from '../../shared/models/account.model';

@Component({
  standalone: true,
  selector: 'app-transactions',
  imports: [CommonModule, MatCardModule, MatSelectModule, MatFormFieldModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent implements OnInit {
  private api = inject(BankingApiService);

  readonly accounts = signal<BankAccount[]>([]);
  readonly operations = signal<AccountOperation[]>([]);
  readonly selectedAccountId = new FormControl<string>('', { nonNullable: true });

  ngOnInit(): void {
    this.api.listAccounts().subscribe((accounts) => {
      this.accounts.set(accounts);
      if (accounts[0]) {
        this.selectedAccountId.setValue(accounts[0].id);
        this.loadOperations(accounts[0].id);
      }
    });

    this.selectedAccountId.valueChanges.subscribe((id) => {
      if (id) this.loadOperations(id);
    });
  }

  private loadOperations(accountId: string): void {
    this.api.accountOperations(accountId).subscribe((ops) => this.operations.set(ops));
  }
}
