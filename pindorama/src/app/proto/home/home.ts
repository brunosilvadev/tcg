import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { NgFor } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Card, mapApiCard } from '../models/card.model';
import { CardComponent } from '../cards/card/card';
import { NavComponent } from '../../shared/nav/nav';
import { CollectionService } from '../services/collection.service';
import { BoosterPackService, LastPackBestCard } from '../services/booster-pack.service';
import { GemsService } from '../services/gems.service';
import { AuthService } from '../../auth/auth.service';

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
  hasPackAvailable: false,
};

@Component({
  selector: 'app-home',
  imports: [NgFor, RouterLink, MatProgressBarModule, CardComponent, NavComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly collectionService = inject(CollectionService);
  private readonly boosterService = inject(BoosterPackService);
  private readonly gemsService = inject(GemsService);

  readonly username = this.auth.getUsername() ?? 'Adventurer';

  readonly collection = signal<HomeCollection>(DEFAULT_COLLECTION);
  readonly booster    = signal<HomeBooster>(DEFAULT_BOOSTER);

  // Raw collection identity (kept separate from the decorated "Collection I · …" display name).
  private readonly collectionName  = signal('');
  private readonly collectionTotal = signal(36);

  // Raw card from /booster-packs/status; converted to the UI Card shape via mapApiCard.
  private readonly lastPackApiCard = signal<LastPackBestCard | null>(null);

  readonly bestCard = computed<Card | null>(() => {
    const api = this.lastPackApiCard();
    if (!api) return null;
    return mapApiCard(api, {
      collectionName: this.collectionName() || undefined,
      collectionSize: this.collectionTotal(),
    });
  });

  readonly flames      = computed(() => this.gemsService.status().gems);
  readonly flameTotal  = computed(() => this.gemsService.status().gemsGoal);
  readonly flameSlots  = computed(() =>
    Array.from({ length: this.flameTotal() }, (_, i) => i),
  );

  readonly tasks             = computed(() => this.gemsService.status().tasks);
  readonly loginQuestDone    = computed(() => this.tasks().login);
  readonly viewCardQuestDone = computed(() => this.tasks().viewCard);
  readonly factQuestDone     = computed(() => this.tasks().clickLink);

  readonly allQuestsDone = computed(() =>
    this.loginQuestDone() && this.viewCardQuestDone() && this.factQuestDone(),
  );

  ngOnInit(): void {
    // Pick the first active collection for the progress card.
    this.collectionService.getAll().subscribe(list => {
      const first = list[0];
      if (!first) return;

      this.collectionService.getById(first.id).subscribe(detail => {
        const rarities = detail.rarityBreakdown
          .map(r => ({
            label:  this.capitalize(r.rarity),
            rarity: r.rarity.toLowerCase(),
            owned:  0,
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
        this.collectionName.set(detail.name);
        this.collectionTotal.set(detail.totalCards);

        // Progress requires auth — swallow 401s so the guest view still renders zeros.
        this.collectionService.getProgress(first.id).subscribe({
          next: progress => {
            const ownedByRarity = new Map(
              progress.rarityBreakdown.map(r => [r.rarity.toLowerCase(), r.owned]),
            );
            this.collection.update(c => ({
              ...c,
              owned:    progress.owned,
              missing:  progress.missing,
              progress: progress.total > 0 ? (progress.owned / progress.total) * 100 : 0,
              rarities: c.rarities.map(r => ({
                ...r,
                owned: ownedByRarity.get(r.rarity) ?? 0,
              })),
            }));
          },
          error: () => { /* unauthenticated — keep zeros */ },
        });
      });
    });

    // Pack status requires auth — swallow 401s so the guest experience still renders.
    this.boosterService.getStatus().subscribe({
      next: status => {
        this.booster.set({
          streakDays:       status.loginStreak,
          hasPackAvailable: status.packsAvailable > 0,
        });
        this.lastPackApiCard.set(status.lastPackBestCard);
      },
      error: () => { /* unauthenticated — keep defaults */ },
    });

    // Gem/tasks state drives the 5-gem meter and today's task list.
    this.gemsService.refreshStatus();
  }

  onBoosterCardClick(): void {
    if (this.booster().hasPackAvailable) {
      this.router.navigateByUrl('/proto/pack-opening');
    }
  }

  onViewCardQuest(): void {
    this.router.navigateByUrl('/proto/cards');
  }

  onFactQuest(): void {
    // Fire-and-forget — the reward toast + gem counter update come from the service.
    this.gemsService.completeClickLinkTask().subscribe();
  }

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
