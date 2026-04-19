import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service';
import { ApiCard, Card, mapApiCard } from '../models/card.model';

export interface PackOpeningResult {
  packId: string;
  setName: string;
  cards: Card[];
}

interface OpenPackResponse {
  packOpenId: string;
  collectionId: string;
  openedAt: string;
  cards: ApiCard[];
}

interface PackStatusResponse {
  packsAvailable: number;
}

@Injectable({ providedIn: 'root' })
export class PackService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly base = `${environment.apiUrl}/booster-packs`;

  readonly hasAvailablePack = signal(false);

  refreshStatus(): void {
    if (!this.auth.getAccessToken()) {
      this.hasAvailablePack.set(false);
      return;
    }

    this.http.get<PackStatusResponse>(`${this.base}/status`).subscribe({
      next: res => this.hasAvailablePack.set(res.packsAvailable > 0),
      error: () => this.hasAvailablePack.set(false),
    });
  }

  openPack(collectionId?: string): Observable<PackOpeningResult> {
    let params = new HttpParams();
    if (collectionId) params = params.set('collectionId', collectionId);

    return this.http.get<OpenPackResponse>(`${this.base}/open`, { params }).pipe(
      tap(() => this.refreshStatus()),
      map(res => ({
        packId: res.packOpenId,
        setName: res.collectionId,
        cards: res.cards.map(c => mapApiCard(c)),
      })),
    );
  }
}
