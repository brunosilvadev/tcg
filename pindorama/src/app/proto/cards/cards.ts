import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { Card } from '../models/card.model';
import { MOCK_CARDS } from './mock-cards';
import { CardComponent } from './card/card';
import { CardLightboxComponent } from './card-lightbox/card-lightbox';

@Component({
  selector: 'app-cards',
  imports: [NgIf, NgFor, CardComponent, CardLightboxComponent],
  templateUrl: './cards.html',
  styleUrl: './cards.scss',
})
export class CardsPageComponent {
  cards: Card[] = MOCK_CARDS;
  selectedCard: Card | null = null;

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
