import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PackService } from '../../services/pack.service';
import { GemsService } from '../../services/gems.service';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class NavComponent implements OnInit {
  readonly packService = inject(PackService);
  readonly gemsService = inject(GemsService);

  readonly flames      = computed(() => this.gemsService.status().gems);
  readonly flamesGoal  = computed(() => this.gemsService.status().gemsGoal);

  ngOnInit(): void {
    this.packService.refreshStatus();
    this.gemsService.refreshStatus();
  }
}
