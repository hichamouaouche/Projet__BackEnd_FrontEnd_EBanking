import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BankingApiService } from '../../core/services/banking-api.service';
import { BankAccount } from '../../shared/models/account.model';
import { AccountHistory } from '../../shared/models/operation.model';

@Component({
  standalone: true,
  selector: 'app-account-detail',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './account-detail.component.html',
  styleUrl: './account-detail.component.css',
})
export class AccountDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(BankingApiService);

  readonly account = signal<BankAccount | null>(null);
  readonly history = signal<AccountHistory | null>(null);
  readonly page = signal(0);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const accountId = this.route.snapshot.paramMap.get('id');
    if (!accountId) {
      return;
    }

    this.api.getAccount(accountId).subscribe((account) => this.account.set(account));
    this.api.accountHistory(accountId, this.page(), 8).subscribe((history) => this.history.set(history));
  }

  nextPage(): void {
    const history = this.history();
    if (!history || this.page() + 1 >= history.totalPages) {
      return;
    }
    this.page.update((p) => p + 1);
    this.load();
  }

  previousPage(): void {
    if (this.page() === 0) {
      return;
    }
    this.page.update((p) => p - 1);
    this.load();
  }
}
