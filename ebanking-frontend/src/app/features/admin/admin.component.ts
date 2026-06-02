import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BankingApiService } from '../../core/services/banking-api.service';
import { BankAccount, isCurrentAccount } from '../../shared/models/account.model';

@Component({
  standalone: true,
  selector: 'app-admin',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  private api = inject(BankingApiService);

  readonly accounts = signal<BankAccount[]>([]);
  readonly topAccounts = signal<BankAccount[]>([]);

  ngOnInit(): void {
    this.api.listAccounts().subscribe((accounts) => {
      this.accounts.set(accounts);
      this.topAccounts.set([...accounts].sort((a, b) => b.balance - a.balance).slice(0, 5));
    });
  }

  get currentCount(): number {
    return this.accounts().filter((a) => isCurrentAccount(a)).length;
  }

  get savingCount(): number {
    return this.accounts().length - this.currentCount;
  }
}
