import { Component, inject } from '@angular/core';
import { GemsService } from '../../proto/services/gems.service';

@Component({
  selector: 'app-reward-toast',
  templateUrl: './reward-toast.html',
  styleUrl: './reward-toast.scss',
})
export class RewardToastComponent {
  private readonly gems = inject(GemsService);

  readonly reward = this.gems.reward;

  dismiss(): void {
    this.gems.dismissReward();
  }
}
