import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiCard, Card, mapApiCard } from '../models/card.model';

export interface CollectionSummary {
  id: string;
  name: string;
  slug: string;
  description?: string;
  totalCards: number;
  createdAt: string;
}

export interface RarityCount {
  rarity: string;
  count: number;
}

export interface CollectionDetail extends CollectionSummary {
  cardCount: number;
  rarityBreakdown: RarityCount[];
}

export interface RarityProgress {
  rarity: string;
  owned: number;
  total: number;
}

export interface CollectionProgress {
  collectionId: string;
  owned: number;
  total: number;
  missing: number;
  rarityBreakdown: RarityProgress[];
}

@Injectable({ providedIn: 'root' })
export class CollectionService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/collections`;

  getAll(): Observable<CollectionSummary[]> {
    return this.http.get<CollectionSummary[]>(this.base);
  }

  getById(id: string): Observable<CollectionDetail> {
    return this.http.get<CollectionDetail>(`${this.base}/${id}`);
  }

  getProgress(id: string): Observable<CollectionProgress> {
    return this.http.get<CollectionProgress>(`${this.base}/${id}/progress`);
  }

  getCards(collectionId: string, ctx?: { collectionName?: string; totalCards?: number }): Observable<Card[]> {
    return this.http
      .get<ApiCard[]>(`${this.base}/${collectionId}/cards`)
      .pipe(
        map(list => list.map(c => mapApiCard(c, {
          collectionName: ctx?.collectionName,
          collectionSize: ctx?.totalCards,
        }))),
      );
  }
}
