import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  gems?: number;
  gemAwarded?: boolean;
  packAwarded?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/auth`;

  private readonly ACCESS_KEY  = 'pindorama_access_token';
  private readonly REFRESH_KEY = 'pindorama_refresh_token';

  signup(email: string, username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.base}/register`, { email, username, password })
      .pipe(tap(res => this.storeTokens(res)));
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.base}/login`, { email, password })
      .pipe(tap(res => this.storeTokens(res)));
  }

  refresh(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    return this.http
      .post<AuthResponse>(`${this.base}/refresh`, { refreshToken })
      .pipe(tap(res => this.storeTokens(res)));
  }

  logout(): void {
    this.clearTokens();
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  getUsername(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['unique_name'] ?? null;
    } catch {
      return null;
    }
  }

  private storeTokens(res: AuthResponse): void {
    localStorage.setItem(this.ACCESS_KEY,  res.accessToken);
    localStorage.setItem(this.REFRESH_KEY, res.refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem(this.ACCESS_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
  }
}
