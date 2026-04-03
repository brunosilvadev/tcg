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
  @Output() clicked = new EventEmitter<Card>();

  get rarityInitial(): string {
    return this.card.rarity[0].toUpperCase();
  }
}
