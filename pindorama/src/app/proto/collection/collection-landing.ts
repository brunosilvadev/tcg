import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavComponent } from '../../shared/nav/nav';
import { CollectionService, CollectionDetail } from '../services/collection.service';

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
    this.collectionService.getAll().subscribe(list => {
      const match = list.find(c => c.slug === TUPINAMBA_SLUG);
      if (!match) return;

      this.collectionService.getById(match.id).subscribe(detail => {
        this.collection.set(this.toCollectionInfo(detail));
      });
    });
  }

  get progress(): number {
    const c = this.collection();
    return c.totalCards === 0 ? 0 : (c.owned / c.totalCards) * 100;
  }

  private toCollectionInfo(detail: CollectionDetail): CollectionInfo {
    const rarities = detail.rarityBreakdown
      .filter(r => r.rarity.toLowerCase() !== 'legendary') // UI shows 3 tiers
      .map(r => ({
        label: this.capitalize(r.rarity),
        owned: 0,
        total: r.count,
        type:  r.rarity.toLowerCase(),
      }));

    return {
      eyebrow:    'Pindorama · Coleção I',
      name:       detail.name,
      subtitle:   detail.description ?? '',
      totalCards: detail.totalCards,
      owned:      0,
      rarities,
    };
  }

  private capitalize(v: string): string {
    return v.length ? v.charAt(0).toUpperCase() + v.slice(1).toLowerCase() : v;
  }
}
