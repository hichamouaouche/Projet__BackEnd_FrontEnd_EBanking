import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'ebanking-theme';
  readonly mode = signal<ThemeMode>((localStorage.getItem(this.storageKey) as ThemeMode) || 'light');

  constructor() {
    this.applyTheme(this.mode());
  }

  toggleTheme(): void {
    const next = this.mode() === 'light' ? 'dark' : 'light';
    this.mode.set(next);
    localStorage.setItem(this.storageKey, next);
    this.applyTheme(next);
  }

  private applyTheme(mode: ThemeMode): void {
    document.documentElement.setAttribute('data-theme', mode);
  }
}
