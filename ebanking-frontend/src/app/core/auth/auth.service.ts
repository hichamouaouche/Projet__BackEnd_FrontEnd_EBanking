import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  AppSession,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  UserRole,
} from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storageKey = 'ebanking-session';
  private readonly sessionSignal = signal<AppSession | null>(this.readStoredSession());

  readonly session = computed(() => this.sessionSignal());
  readonly isAuthenticated = computed(() => {
    const current = this.sessionSignal();
    return Boolean(current && current.expiresAt > Date.now());
  });

  login(payload: LoginPayload): Observable<AppSession> {
    return this.http
      .post<AuthResponse>(`${environment.apiBaseUrl}/auth/login`, payload)
      .pipe(
        map((res) => {
          const session = this.buildSession(res);
          this.setSession(session);
          return session;
        }),
        catchError((err) =>
          environment.production ? throwError(() => err) : this.mockLogin(payload),
        ),
      );
  }

  register(payload: RegisterPayload): Observable<AppSession> {
    return this.http
      .post<AuthResponse>(`${environment.apiBaseUrl}/auth/register`, payload)
      .pipe(
        map((res) => {
          const session = this.buildSession(res);
          this.setSession(session);
          return session;
        }),
        catchError((err) => throwError(() => err)),
      );
  }

  logout(): void {
    this.sessionSignal.set(null);
    localStorage.removeItem(this.storageKey);
  }

  getToken(): string | null {
    return this.sessionSignal()?.token ?? null;
  }

  private buildSession(res: AuthResponse): AppSession {
    return {
      token: res.token,
      username: res.email,
      firstName: res.firstName,
      lastName: res.lastName,
      role: (res.role as UserRole) ?? 'USER',
      expiresAt: Date.now() + res.expiresIn,
    };
  }

  private setSession(session: AppSession): void {
    this.sessionSignal.set(session);
    localStorage.setItem(this.storageKey, JSON.stringify(session));
  }

  private mockLogin(payload: LoginPayload): Observable<AppSession> {
    if (!payload.email || !payload.password) {
      return throwError(() => new Error('Identifiants invalides'));
    }
    const role: UserRole = payload.email.toLowerCase().includes('admin') ? 'ADMIN' : 'USER';
    const nameParts = payload.email.split('@')[0].split('.');
    const session: AppSession = {
      token: `mock-token-${Date.now()}`,
      username: payload.email,
      firstName: nameParts[0] ?? 'Utilisateur',
      lastName: nameParts[1] ?? '',
      role,
      expiresAt: Date.now() + 1000 * 60 * 60 * 8,
    };
    this.setSession(session);
    return of(session).pipe(delay(400));
  }

  private readStoredSession(): AppSession | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as AppSession;
      if (parsed.expiresAt <= Date.now()) {
        localStorage.removeItem(this.storageKey);
        return null;
      }
      return parsed;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}
