import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Card } from '../models/card.model';
import { CardComponent } from '../cards/card/card';
import { NavComponent } from '../../shared/nav/nav';
import { CollectionService } from '../services/collection.service';
import { BoosterPackService } from '../services/booster-pack.service';

interface HomeCollection {
  name: string;
  owned: number;
  total: number;
  missing: number;
  progress: number;
  rarities: Array<{ label: string; rarity: string; owned: number; total: number }>;
}

interface HomeBooster {
  streakDays: number;
  gemCount: number;
  gemTotal: number;
  hasPackAvailable: boolean;
}

const DEFAULT_COLLECTION: HomeCollection = {
  name: '',
  owned: 0,
  total: 0,
  missing: 0,
  progress: 0,
  rarities: [],
};

const DEFAULT_BOOSTER: HomeBooster = {
  streakDays: 0,
  gemCount: 0,
  gemTotal: 5,
  hasPackAvailable: false,
};

@Component({
  selector: 'app-home',
  imports: [NgFor, MatProgressBarModule, CardComponent, NavComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly collectionService = inject(CollectionService);
  private readonly boosterService = inject(BoosterPackService);

  readonly username = 'Adventurer';

  readonly collection = signal<HomeCollection>(DEFAULT_COLLECTION);
  readonly booster    = signal<HomeBooster>(DEFAULT_BOOSTER);

  readonly gemSlots = [0, 1, 2, 3, 4];

  readonly loginQuestDone    = signal(true);
  readonly viewCardQuestDone = signal(false);
  readonly factQuestDone     = signal(false);

  readonly allQuestsDone = computed(() =>
    this.loginQuestDone() && this.viewCardQuestDone() && this.factQuestDone()
  );

  ngOnInit(): void {
    // Pick the first active collection for the progress card.
    this.collectionService.getAll().subscribe(list => {
      const first = list[0];
      if (!first) return;

      this.collectionService.getById(first.id).subscribe(detail => {
        const rarities = detail.rarityBreakdown
          .filter(r => r.rarity.toLowerCase() !== 'legendary')
          .map(r => ({
            label:  this.capitalize(r.rarity),
            rarity: r.rarity.toLowerCase(),
            owned:  0, // No user-cards endpoint yet.
            total:  r.count,
          }));

        this.collection.set({
          name:     `Collection I · ${detail.name}`,
          owned:    0,
          total:    detail.totalCards,
          missing:  detail.totalCards,
          progress: 0,
          rarities,
        });
      });
    });

    // Pack status requires auth — swallow 401s so the guest experience still renders.
    this.boosterService.getStatus().subscribe({
      next: status => this.booster.set({
        streakDays:       status.loginStreak,
        gemCount:         Math.min(status.progress.totalPacksOpened, DEFAULT_BOOSTER.gemTotal),
        gemTotal:         DEFAULT_BOOSTER.gemTotal,
        hasPackAvailable: status.packsAvailable > 0,
      }),
      error: () => { /* unauthenticated — keep defaults */ },
    });
  }

  onBoosterCardClick(): void {
    if (this.booster().hasPackAvailable) {
      this.router.navigateByUrl('/proto/pack-opening');
    }
  }

  onViewCardQuest(): void {
    this.viewCardQuestDone.set(true);
    this.router.navigateByUrl('/proto/collection');
  }

  onFactQuest(): void {
    this.factQuestDone.set(true);
  }

  // No "best card" endpoint yet — keep a placeholder until one exists.
  readonly bestCard: Card = {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Tupã',
    type: 'Deity',
    rarity: 'rare',
    cardNumber: 1,
    collectionSize: 36,
    collection: 'Tupinambá',
    imageUrl: 'https://placehold.co/280x244/2a1500/d4a017',
    flavorText: 'Voice of thunder across the great water, his breath shapes the storm.',
    artistName: 'M. Cavalcante',
  };

  // No daily-fact endpoint yet.
  readonly factOfDay = {
    text: 'The Tupinambá were one of the most widespread indigenous peoples of coastal Brazil, known for their fierce resistance to colonization and the rich oral traditions that shaped Brazilian folklore for centuries.',
    tag: 'Culture',
    link: 'https://en.wikipedia.org/wiki/Tupinamba_people',
  };

  private capitalize(v: string): string {
    return v.length ? v.charAt(0).toUpperCase() + v.slice(1).toLowerCase() : v;
  }
}
