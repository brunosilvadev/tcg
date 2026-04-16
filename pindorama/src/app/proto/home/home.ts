import { Component, computed, inject, signal } from '@angular/core';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Card } from '../models/card.model';
import { CardComponent } from '../cards/card/card';
import { NavComponent } from '../../shared/nav/nav';

@Component({
  selector: 'app-home',
  imports: [NgFor, MatProgressBarModule, CardComponent, NavComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  private readonly router = inject(Router);

  readonly username = 'Adventurer';

  readonly collection = {
    name: 'Collection I · Tupinambá',
    owned: 24,
    total: 36,
    missing: 12,
    progress: (24 / 36) * 100,
    rarities: [
      { label: 'Common',   rarity: 'common',   owned: 8,  total: 12 },
      { label: 'Uncommon', rarity: 'uncommon',  owned: 10, total: 14 },
      { label: 'Rare',     rarity: 'rare',      owned: 6,  total: 10 },
    ],
  };

  readonly booster = {
    streakDays: 7,
    gemCount: 3,
    gemTotal: 5,
    hasPackAvailable: false,
  };

  readonly gemSlots = [0, 1, 2, 3, 4];

  // ── Daily quests — in-memory signals, no API ──────────────────
  // "Log in today" auto-completes on page load.
  readonly loginQuestDone    = signal(true);
  readonly viewCardQuestDone = signal(false);
  readonly factQuestDone     = signal(false);

  readonly allQuestsDone = computed(() =>
    this.loginQuestDone() && this.viewCardQuestDone() && this.factQuestDone()
  );

  onBoosterCardClick(): void {
    if (this.booster.hasPackAvailable) {
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

  readonly bestCard: Card = {
    id: 1,
    name: 'Tupã',
    type: 'Deity',
    rarity: 'rare',
    cardNumber: 1,
    collectionSize: 45,
    collection: 'TUP-1: The First Peoples',
    imageUrl: 'https://placehold.co/280x244/2a1500/d4a017',
    flavorText: 'Lord of thunder and the sky, Tupã shaped the earth with lightning and filled the rivers with his tears of rain.',
    artistName: 'M. Cavalcante',
  };

  readonly factOfDay = {
    text: 'The Tupinambá were one of the most widespread indigenous peoples of coastal Brazil, known for their fierce resistance to colonization and the rich oral traditions that shaped Brazilian folklore for centuries.',
    tag: 'Culture',
    link: 'https://en.wikipedia.org/wiki/Tupinamba_people',
  };
}
