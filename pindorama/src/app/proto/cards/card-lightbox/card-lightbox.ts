import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { NgIf } from '@angular/common';
import { Card } from '../../models/card.model';
import { CardComponent } from '../card/card';

const GLOW_COLORS: Record<string, string> = {
  common:   'rgba(156, 163, 175, 0.65)',
  uncommon: 'rgba(82,  183, 136, 0.65)',
  rare:     'rgba(212, 160,  23, 0.80)',
};

@Component({
  selector: 'app-card-lightbox',
  imports: [NgIf, CardComponent],
  templateUrl: './card-lightbox.html',
  styleUrl: './card-lightbox.scss',
})
export class CardLightboxComponent {
  @Input() card: Card | null = null;
  @Output() close = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.card) this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as Element).classList.contains('lightbox')) {
      this.close.emit();
    }
  }

  get glowColor(): string {
    return this.card ? (GLOW_COLORS[this.card.rarity] ?? 'transparent') : 'transparent';
  }
}
