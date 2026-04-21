import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PackService } from '../../proto/services/pack.service';
import { GemsService } from '../../proto/services/gems.service';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class NavComponent implements OnInit {
  readonly packService = inject(PackService);
  readonly gemsService = inject(GemsService);

  readonly gems     = computed(() => this.gemsService.status().gems);
  readonly gemsGoal = computed(() => this.gemsService.status().gemsGoal);

  ngOnInit(): void {
    this.packService.refreshStatus();
    this.gemsService.refreshStatus();
  }
}
