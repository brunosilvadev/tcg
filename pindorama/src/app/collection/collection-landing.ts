import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EMPTY, forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { NavComponent } from '../shared/nav/nav';
import { CollectionService, CollectionDetail, CollectionProgress } from '../services/collection.service';

export interface CollectionInfo {
  eyebrow:    string;
  name:       string;
  subtitle:   string;
  totalCards: number;
  owned:      number;
  rarities: Array<{
    label: string;
    owned: number;
    total: number;
    type:  string;
  }>;
}

const TUPINAMBA_SLUG = 'tupinamba';

const TUPINAMBA_FALLBACK: CollectionInfo = {
  eyebrow:    'Pindorama · Coleção I',
  name:       'Tupinambá',
  subtitle:   'Povo da costa atlântica',
  totalCards: 36,
  owned:      0,
  rarities: [],
};

@Component({
  selector:    'app-collection-landing',
  standalone:  true,
  imports:     [RouterLink, NavComponent],
  templateUrl: './collection-landing.html',
  styleUrl:    './collection-landing.scss',
})
export class CollectionLandingComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly collectionService = inject(CollectionService);

  readonly collection = signal<CollectionInfo>(TUPINAMBA_FALLBACK);

  readonly particles = [
    { left: '8%',  delay: '0s',   dur: '10s', isGold: true  },
    { left: '19%', delay: '2.4s', dur: '13s', isGold: false },
    { left: '31%', delay: '1.1s', dur: '9s',  isGold: true  },
    { left: '46%', delay: '3.9s', dur: '12s', isGold: false },
    { left: '57%', delay: '0.7s', dur: '8s',  isGold: true  },
    { left: '69%', delay: '2.8s', dur: '14s', isGold: false },
    { left: '81%', delay: '1.6s', dur: '11s', isGold: true  },
    { left: '92%', delay: '4.3s', dur: '9s',  isGold: false },
  ];

  ngOnInit(): void {
    this.collectionService.getAll().pipe(
      switchMap(list => {
        const match = list.find(c => c.slug === TUPINAMBA_SLUG);
        if (!match) return EMPTY;
        return forkJoin({
          detail:   this.collectionService.getById(match.id),
          progress: this.auth.isLoggedIn()
            ? this.collectionService.getProgress(match.id).pipe(catchError(() => of(null)))
            : of(null),
        });
      }),
    ).subscribe(({ detail, progress }) => {
      this.collection.set(this.toCollectionInfo(detail, progress));
    });
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  get progress(): number {
    const c = this.collection();
    return c.totalCards === 0 ? 0 : (c.owned / c.totalCards) * 100;
  }

  private toCollectionInfo(detail: CollectionDetail, progress: CollectionProgress | null): CollectionInfo {
    const ownedByRarity = new Map(
      (progress?.rarityBreakdown ?? []).map(r => [r.rarity.toLowerCase(), r.owned]),
    );

    const rarities = detail.rarityBreakdown
      .map(r => ({
        label: this.capitalize(r.rarity),
        owned: ownedByRarity.get(r.rarity.toLowerCase()) ?? 0,
        total: r.count,
        type:  r.rarity.toLowerCase(),
      }));

    return {
      eyebrow:    'Pindorama · Coleção I',
      name:       detail.name,
      subtitle:   detail.description ?? '',
      totalCards: detail.totalCards,
      owned:      progress?.owned ?? 0,
      rarities,
    };
  }

  private capitalize(v: string): string {
    return v.length ? v.charAt(0).toUpperCase() + v.slice(1).toLowerCase() : v;
  }
}
