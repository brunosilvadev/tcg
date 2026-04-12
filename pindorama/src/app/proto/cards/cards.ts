import { Component, signal, computed } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { Card, Rarity } from '../models/card.model';
import { MOCK_CARDS } from './mock-cards';
import { CardComponent } from './card/card';
import { CardLightboxComponent } from './card-lightbox/card-lightbox';
import { FooterComponent } from '../../shared/footer/footer';

@Component({
  selector: 'app-cards',
  imports: [NgIf, NgFor, CardComponent, CardLightboxComponent, FooterComponent],
  templateUrl: './cards.html',
  styleUrl: './cards.scss',
})
export class CardsPageComponent {
  readonly allCards: Card[] = MOCK_CARDS;
  selectedCard: Card | null = null;

  readonly rarities: { value: Rarity; label: string }[] = [
    { value: 'common',    label: 'Common'    },
    { value: 'uncommon',  label: 'Uncommon'  },
    { value: 'rare',      label: 'Rare'      },
    { value: 'legendary', label: 'Legendary' },
  ];

  readonly activeRarities = signal(new Set<Rarity>());
  readonly hasFilter      = computed(() => this.activeRarities().size > 0);
  readonly filteredCards  = computed(() => {
    const active = this.activeRarities();
    return active.size === 0
      ? this.allCards
      : this.allCards.filter(c => active.has(c.rarity));
  });

  toggleRarity(rarity: Rarity): void {
    this.activeRarities.update(set => {
      const next = new Set(set);
      next.has(rarity) ? next.delete(rarity) : next.add(rarity);
      return next;
    });
  }

  isActive(rarity: Rarity): boolean {
    return this.activeRarities().has(rarity);
  }

  clearFilter(): void {
    this.activeRarities.set(new Set());
  }

  openLightbox(card: Card): void {
    this.selectedCard = card;
  }

  closeLightbox(): void {
    this.selectedCard = null;
  }

  trackById(_: number, card: Card): number {
    return card.id;
  }
}
