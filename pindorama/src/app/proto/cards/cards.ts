import { Component, signal, computed } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { Card, Rarity } from '../models/card.model';
import { MOCK_CARDS } from './mock-cards';
import { CardComponent } from './card/card';
import { CardLightboxComponent } from './card-lightbox/card-lightbox';
import { FooterComponent } from '../../shared/footer/footer';
import { NavComponent } from '../../shared/nav/nav';

@Component({
  selector: 'app-cards',
  imports: [NgIf, NgFor, CardComponent, CardLightboxComponent, FooterComponent, NavComponent],
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
  readonly searchQuery    = signal('');

  readonly hasFilter    = computed(() => this.activeRarities().size > 0);
  readonly hasSearch    = computed(() => this.searchQuery().trim().length > 0);
  readonly hasAnyFilter = computed(() => this.hasFilter() || this.hasSearch());

  readonly filteredCards = computed(() => {
    const active = this.activeRarities();
    const q      = this.searchQuery().trim().toLowerCase();
    return this.allCards.filter(c => {
      const passesRarity = active.size === 0 || active.has(c.rarity);
      const passesSearch = !q || c.name.toLowerCase().includes(q)
                               || c.type.toLowerCase().includes(q);
      return passesRarity && passesSearch;
    });
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

  clearFilter(): void { this.activeRarities.set(new Set()); }
  clearSearch(): void { this.searchQuery.set(''); }
  clearAll():   void  { this.clearFilter(); this.clearSearch(); }

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
