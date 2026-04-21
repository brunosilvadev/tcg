import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service';
import { PackService } from './pack.service';

export interface GemsTasks {
  login: boolean;
  viewCard: boolean;
  clickLink: boolean;
}

export interface GemsStatus {
  gems: number;
  gemsGoal: number;
  tasks: GemsTasks;
}

export interface GemTaskResult {
  wasNew: boolean;
  gems: number;
  gemsGoal: number;
  packAwarded: boolean;
}

export interface LoginGemResult {
  gemAwarded?: boolean;
  gems?: number;
  gemsGoal?: number;
  packAwarded?: boolean;
}

export type RewardKind = 'gem' | 'pack';
export interface RewardNotice {
  id: number;
  kind: RewardKind;
  message: string;
}

const DEFAULT_STATUS: GemsStatus = {
  gems: 0,
  gemsGoal: 5,
  tasks: { login: false, viewCard: false, clickLink: false },
};

@Injectable({ providedIn: 'root' })
export class GemsService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly packs = inject(PackService);
  private readonly base = `${environment.apiUrl}/gems`;

  readonly status = signal<GemsStatus>(DEFAULT_STATUS);
  readonly reward = signal<RewardNotice | null>(null);

  private nextRewardId = 1;
  private clearTimer: ReturnType<typeof setTimeout> | null = null;

  refreshStatus(): void {
    if (!this.auth.getAccessToken()) {
      this.status.set(DEFAULT_STATUS);
      return;
    }
    this.http.get<GemsStatus>(`${this.base}/status`).subscribe({
      next: s => this.status.set(s),
      error: () => this.status.set(DEFAULT_STATUS),
    });
  }

  completeViewCardTask(): Observable<GemTaskResult | null> {
    return this.postTask('view-card');
  }

  completeClickLinkTask(): Observable<GemTaskResult | null> {
    return this.postTask('click-link');
  }

  applyLoginResult(res: LoginGemResult): void {
    if (typeof res.gems === 'number') {
      this.status.update(s => ({
        ...s,
        gems: res.gems!,
        gemsGoal: res.gemsGoal ?? s.gemsGoal,
        tasks: { ...s.tasks, login: true },
      }));
    }
    if (res.gemAwarded) this.pushReward('gem', '+1 gem for logging in today');
    if (res.packAwarded) {
      this.packs.refreshStatus();
      this.pushReward('pack', 'Booster pack awarded!');
    }
  }

  dismissReward(): void {
    if (this.clearTimer) {
      clearTimeout(this.clearTimer);
      this.clearTimer = null;
    }
    this.reward.set(null);
  }

  private postTask(kind: 'view-card' | 'click-link'): Observable<GemTaskResult | null> {
    if (!this.auth.getAccessToken()) return of(null);
    return this.http.post<GemTaskResult>(`${this.base}/tasks/${kind}`, {}).pipe(
      tap(res => this.applyTaskResult(kind, res)),
      catchError(() => of(null)),
    );
  }

  private applyTaskResult(kind: 'view-card' | 'click-link', res: GemTaskResult): void {
    this.status.update(s => ({
      gems: res.gems,
      gemsGoal: res.gemsGoal,
      tasks: {
        ...s.tasks,
        viewCard: kind === 'view-card' ? true : s.tasks.viewCard,
        clickLink: kind === 'click-link' ? true : s.tasks.clickLink,
      },
    }));
    if (!res.wasNew) return;

    const label = kind === 'view-card' ? 'viewing a card' : 'exploring the link';
    this.pushReward('gem', `+1 gem for ${label}`);
    if (res.packAwarded) {
      this.packs.refreshStatus();
      this.pushReward('pack', 'Booster pack awarded!');
    }
  }

  private pushReward(kind: RewardKind, message: string): void {
    // Simple queue: pack rewards replace gem rewards (pack is the bigger event).
    const current = this.reward();
    if (current && current.kind === 'pack' && kind === 'gem') return;

    if (this.clearTimer) clearTimeout(this.clearTimer);
    this.reward.set({ id: this.nextRewardId++, kind, message });
    this.clearTimer = setTimeout(() => {
      this.reward.set(null);
      this.clearTimer = null;
    }, kind === 'pack' ? 4000 : 2500);
  }
}
