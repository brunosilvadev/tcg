import { Component, inject } from '@angular/core';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-notification-toast',
  templateUrl: './notification-toast.html',
  styleUrl: './notification-toast.scss',
})
export class NotificationToastComponent {
  private readonly notifications = inject(NotificationService);

  readonly notification = this.notifications.notification;

  dismiss(): void {
    this.notifications.dismiss();
  }
}
