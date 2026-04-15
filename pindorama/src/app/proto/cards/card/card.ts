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
