import { Injectable, signal } from '@angular/core';

export type NotificationKind = 'success' | 'error';

export interface Notification {
  kind: NotificationKind;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _notification = signal<Notification | null>(null);
  private _timer: ReturnType<typeof setTimeout> | null = null;

  readonly notification = this._notification.asReadonly();

  show(kind: NotificationKind, message: string, durationMs = 4000): void {
    if (this._timer) clearTimeout(this._timer);
    this._notification.set({ kind, message });
    this._timer = setTimeout(() => this.dismiss(), durationMs);
  }

  dismiss(): void {
    this._notification.set(null);
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }
}
