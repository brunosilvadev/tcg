import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf } from '@angular/common';
import { Card } from '../../models/card.model';

@Component({
  selector: 'app-card',
  imports: [NgIf],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class CardComponent {
  @Input({ required: true }) card!: Card;
  // When true, clicks flip the card instead of emitting clicked
  @Input() flipEnabled = false;
  @Output() clicked = new EventEmitter<Card>();

  @Input() isFlipped = false;

  get rarityInitial(): string {
    return this.card.rarity[0].toUpperCase();
  }

  private static readonly TYPE_ICONS: Record<string, string> = {
    // Lightning bolt
    'Deity':    'M13 2L3 14h7l-2 8 10-12h-7l2-8z',
    // Wisp flame
    'Spirit':   'M12 2c-1 4-4 6-4 10a4 4 0 008 0c0-4-3-6-4-10zm0 14a2 2 0 01-2-2c0-1.5 2-4 2-4s2 2.5 2 4a2 2 0 01-2 2z',
    // Paw print
    'Creature': 'M12 18c-2 0-4-1.5-4-3 0-1 .7-2.4 2-3.5 1-.8 2-1 2-1s1 .2 2 1c1.3 1.1 2 2.5 2 3.5 0 1.5-2 3-4 3zm-4.5-6a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm-7-4a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z',
    // 5-pointed star
    'Ritual':   'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
    // Location pin
    'Place':    'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    // All-seeing eye (amulet)
    'Artifact': 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
    // Human silhouette
    'Person':   'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  };

  get typeIconPath(): string {
    return CardComponent.TYPE_ICONS[this.card.type] ?? CardComponent.TYPE_ICONS['Creature'];
  }

  onCardClick(): void {
    if (this.flipEnabled) {
      this.isFlipped = !this.isFlipped;
    } else {
      this.clicked.emit(this.card);
    }
  }
}
