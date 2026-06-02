import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { BankingApiService } from '../../core/services/banking-api.service';
import { Customer } from '../../shared/models/customer.model';

@Component({
  standalone: true,
  selector: 'app-user-detail',
  imports: [CommonModule, MatCardModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css',
})
export class UserDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(BankingApiService);

  readonly customer = signal<Customer | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(id)) {
      return;
    }
    this.api.getCustomer(id).subscribe((customer) => this.customer.set(customer));
  }
}
