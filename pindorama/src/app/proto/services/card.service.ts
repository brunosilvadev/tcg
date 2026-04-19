import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiCard, Card, mapApiCard, Rarity } from '../models/card.model';

export interface CardFilter {
  rarity?: Rarity;
  type?: string;
}

@Injectable({ providedIn: 'root' })
export class CardService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/cards`;

  getAll(filter: CardFilter = {}): Observable<Card[]> {
    let params = new HttpParams();
    if (filter.rarity) params = params.set('rarity', this.capitalize(filter.rarity));
    if (filter.type)   params = params.set('type',   this.capitalize(filter.type));

    return this.http
      .get<ApiCard[]>(this.base, { params })
      .pipe(map(list => list.map(c => mapApiCard(c))));
  }

  getById(id: string): Observable<Card> {
    return this.http
      .get<ApiCard>(`${this.base}/${id}`)
      .pipe(map(c => mapApiCard(c)));
  }

  private capitalize(v: string): string {
    return v.length ? v.charAt(0).toUpperCase() + v.slice(1).toLowerCase() : v;
  }
}
