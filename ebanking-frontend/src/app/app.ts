import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from './core/auth/auth.service';
import { LoadingService } from './core/services/loading.service';
import { ThemeService } from './core/services/theme.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatProgressBarModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private auth = inject(AuthService);
  readonly loading = inject(LoadingService);
  readonly theme = inject(ThemeService);
  readonly session = computed(() => this.auth.session());
  readonly authed = computed(() => this.auth.isAuthenticated());
  readonly sidenavOpen = signal(true);

  readonly navItems: NavItem[] = [
    { label: 'Tableau de bord', icon: 'dashboard',              route: '/dashboard'    },
    { label: 'Comptes',         icon: 'account_balance_wallet', route: '/accounts'     },
    { label: 'Transactions',    icon: 'swap_horiz',             route: '/transactions' },
    { label: 'Clients',         icon: 'people',                 route: '/users'        },
    { label: 'Administration',  icon: 'admin_panel_settings',   route: '/admin'        },
  ];

  readonly bottomNavItems: NavItem[] = [
    { label: 'Profil',    icon: 'person',   route: '/profile'  },
    { label: 'Parametres', icon: 'settings', route: '/settings' },
  ];

  readonly displayName = computed(() => {
    const s = this.session();
    if (!s) return '';
    if (s.firstName) return `${s.firstName} ${s.lastName ?? ''}`.trim();
    return s.username.split('@')[0];
  });

  readonly initials = computed(() => {
    const name = this.displayName();
    const parts = name.split(' ');
    return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
  });

  toggleSidenav(): void {
    this.sidenavOpen.update((v) => !v);
  }

  logout(): void {
    this.auth.logout();
  }
}
