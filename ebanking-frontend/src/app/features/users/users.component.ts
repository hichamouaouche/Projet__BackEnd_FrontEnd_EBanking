import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BankingApiService } from '../../core/services/banking-api.service';
import { NotificationService } from '../../core/services/notification.service';
import { Customer } from '../../shared/models/customer.model';

@Component({
  standalone: true,
  selector: 'app-users',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(BankingApiService);
  private notifications = inject(NotificationService);
  private router = inject(Router);

  readonly users = signal<Customer[]>([]);
  readonly displayedColumns = ['id', 'name', 'email', 'actions'];
  editingId: number | null = null;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnInit(): void { this.refresh(); }

  refresh(): void {
    this.api.listCustomers().subscribe((users) => this.users.set(users));
  }

  edit(user: Customer): void {
    this.editingId = user.id;
    this.form.patchValue({ name: user.name, email: user.email });
  }

  reset(): void {
    this.editingId = null;
    this.form.reset({ name: '', email: '' });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const payload = this.form.getRawValue();

    if (this.editingId) {
      this.api.updateCustomer(this.editingId, payload).subscribe(() => {
        this.notifications.success('Client modifie.');
        this.reset();
        this.refresh();
      });
      return;
    }

    this.api.createCustomer(payload).subscribe(() => {
      this.notifications.success('Client ajoute.');
      this.reset();
      this.refresh();
    });
  }

  remove(id: number): void {
    this.api.deleteCustomer(id).subscribe(() => {
      this.notifications.info('Client supprime.');
      this.refresh();
    });
  }

  openDetails(id: number): void {
    this.router.navigate(['/users', id]);
  }
}
