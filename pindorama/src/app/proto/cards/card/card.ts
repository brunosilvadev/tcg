import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Card } from '../../models/card.model';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class CardComponent {
  @Input({ required: true }) card!: Card;
  // When true, clicks flip the card instead of emitting clicked
  @Input() flipEnabled = false;
  @Output() clicked = new EventEmitter<Card>();

  isFlipped = false;

  get rarityInitial(): string {
    return this.card.rarity[0].toUpperCase();
  }

  onCardClick(): void {
    if (this.flipEnabled) {
      this.isFlipped = !this.isFlipped;
    } else {
      this.clicked.emit(this.card);
    }
  }
}
