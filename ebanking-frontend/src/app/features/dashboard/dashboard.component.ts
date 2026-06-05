import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin, of, switchMap } from 'rxjs';
import { BankingApiService } from '../../core/services/banking-api.service';
import { BankAccount, isCurrentAccount } from '../../shared/models/account.model';
import { AccountOperation } from '../../shared/models/operation.model';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, DatePipe, RouterLink, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private api = inject(BankingApiService);

  loading = true;
  customerCount = 0;
  accountCount = 0;
  totalBalance = 0;
  currentAccounts = 0;
  savingsAccounts = 0;
  accounts: BankAccount[] = [];
  recentOperations: AccountOperation[] = [];
  readonly today = new Date();

  ngOnInit(): void {
    forkJoin({
      customers: this.api.listCustomers(),
      accounts: this.api.listAccounts(),
    })
      .pipe(
        switchMap(({ customers, accounts }) => {
          this.customerCount = customers.length;
          this.accounts = accounts;
          this.accountCount = accounts.length;
          this.totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
          this.currentAccounts = accounts.filter((a) => isCurrentAccount(a)).length;
          this.savingsAccounts = accounts.length - this.currentAccounts;
          const first = accounts[0];
          if (!first) return of([] as AccountOperation[]);
          return this.api.accountOperations(first.id);
        }),
      )
      .subscribe({
        next: (ops) => {
          this.recentOperations = ops.slice(0, 8);
          this.loading = false;
        },
        error: () => { this.loading = false; },
      });
  }
}
