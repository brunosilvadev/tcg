import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RewardToastComponent } from './shared/reward-toast/reward-toast';
import { NotificationToastComponent } from './shared/notification-toast/notification-toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RewardToastComponent, NotificationToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('pindorama');
}
