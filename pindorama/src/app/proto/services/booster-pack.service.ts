import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface BoosterStatusTask {
  task: string;
  completed: boolean;
}

export interface BoosterStatus {
  packsAvailable: number;
  loginStreak: number;
  lastLoginDate: string | null;
  tasks: BoosterStatusTask[];
  progress: {
    totalPacksOpened: number;
    totalCardsCollected: number;
  };
}

@Injectable({ providedIn: 'root' })
export class BoosterPackService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/booster-packs`;

  getStatus(): Observable<BoosterStatus> {
    return this.http.get<BoosterStatus>(`${this.base}/status`);
  }
}
