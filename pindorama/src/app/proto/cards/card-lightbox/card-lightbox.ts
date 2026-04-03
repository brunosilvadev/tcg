import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { NgIf } from '@angular/common';
import { Card } from '../../models/card.model';
import { CardComponent } from '../card/card';

const GLOW_COLORS: Record<string, string> = {
  common:   'rgba(156, 163, 175, 0.65)',
  uncommon: 'rgba(82,  183, 136, 0.65)',
  rare:     'rgba(212, 160,  23, 0.80)',
};

// Threshold (px) to count a pointer move as a drag
const DRAG_THRESHOLD = 5;

@Component({
  selector: 'app-card-lightbox',
  imports: [NgIf, CardComponent],
  templateUrl: './card-lightbox.html',
  styleUrl: './card-lightbox.scss',
})
export class CardLightboxComponent {
  @Input() card: Card | null = null;
  @Output() close = new EventEmitter<void>();

  // ── Drag state ────────────────────────────────────────────
  dragX = 0;
  dragY = 0;
  isDragging = false;
  isReturning = false;

  private dragStartX = 0;
  private dragStartY = 0;
  private cardStartX = 0;
  private cardStartY = 0;
  private hasDragged = false;
  private dragEndedAt = 0;
  private returnTimer: ReturnType<typeof setTimeout> | null = null;

  // ── Keyboard ──────────────────────────────────────────────
  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.card) this.close.emit();
  }

  // ── Backdrop click ────────────────────────────────────────
  onBackdropClick(event: MouseEvent): void {
    // Ignore if a drag just ended — pointerup may have also triggered a click event
    if (Date.now() - this.dragEndedAt < 150) return;
    if ((event.target as Element).classList.contains('lightbox')) {
      this.close.emit();
    }
  }

  // ── Drag: start ───────────────────────────────────────────
  onPointerDown(event: PointerEvent): void {
    event.preventDefault();
    this.isDragging = true;
    this.isReturning = false;
    this.hasDragged = false;

    if (this.returnTimer) {
      clearTimeout(this.returnTimer);
      this.returnTimer = null;
    }

    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.cardStartX = this.dragX;
    this.cardStartY = this.dragY;

    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  // ── Drag: move ────────────────────────────────────────────
  onPointerMove(event: PointerEvent): void {
    if (!this.isDragging) return;
    const dx = event.clientX - this.dragStartX;
    const dy = event.clientY - this.dragStartY;

    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      this.hasDragged = true;
    }

    this.dragX = this.cardStartX + dx;
    this.dragY = this.cardStartY + dy;
  }

  // ── Drag: end ─────────────────────────────────────────────
  onPointerUp(): void {
    if (!this.isDragging) return;
    this.isDragging = false;

    if (this.hasDragged) {
      this.dragEndedAt = Date.now();
      this.isReturning = true;
      this.dragX = 0;
      this.dragY = 0;
      // Re-enable float after return transition (500ms) completes
      this.returnTimer = setTimeout(() => {
        this.isReturning = false;
        this.returnTimer = null;
      }, 500);
    }
  }

  // ── Helpers ───────────────────────────────────────────────
  get dragTransform(): string {
    if (this.dragX === 0 && this.dragY === 0) return '';
    return `translate(${this.dragX}px, ${this.dragY}px)`;
  }

  get glowColor(): string {
    return this.card ? (GLOW_COLORS[this.card.rarity] ?? 'transparent') : 'transparent';
  }
}
