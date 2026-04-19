import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PackService } from '../../proto/services/pack.service';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class NavComponent implements OnInit {
  readonly packService = inject(PackService);

  ngOnInit(): void {
    this.packService.refreshStatus();
  }
}
