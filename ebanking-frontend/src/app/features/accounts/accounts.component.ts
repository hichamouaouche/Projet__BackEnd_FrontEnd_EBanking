import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BankingApiService } from '../../core/services/banking-api.service';
import { BankAccount, isCurrentAccount } from '../../shared/models/account.model';

@Component({
  standalone: true,
  selector: 'app-accounts',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css',
})
export class AccountsComponent implements OnInit {
  private api = inject(BankingApiService);
  private router = inject(Router);

  readonly search = new FormControl('', { nonNullable: true });
  readonly accounts = signal<BankAccount[]>([]);
  readonly loading = signal(true);
  readonly isCurrentAccount = isCurrentAccount;

  // toSignal rend la valeur du FormControl réactive pour computed()
  private readonly searchTerm = toSignal(this.search.valueChanges, { initialValue: '' });

  readonly filteredAccounts = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.accounts();
    return this.accounts().filter(
      (a) =>
        a.customerDTO.name.toLowerCase().includes(term) ||
        a.customerDTO.email.toLowerCase().includes(term) ||
        a.id.toLowerCase().includes(term),
    );
  });

  ngOnInit(): void {
    this.api.listAccounts().subscribe({
      next: (accounts) => { this.accounts.set(accounts); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  accountType(account: BankAccount): string {
    return isCurrentAccount(account) ? 'Compte courant' : 'Compte epargne';
  }

  openDetails(accountId: string): void {
    this.router.navigate(['/accounts', accountId]);
  }
}
