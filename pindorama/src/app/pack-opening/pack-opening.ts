import {
  Component,
  signal,
  computed,
  inject,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import {
  trigger,
  transition,
  style,
  animate,
  state,
  keyframes,
  query,
  stagger,
} from '@angular/animations';
import { Card } from '../models/card.model';
import { CardComponent } from '../cards/card/card';
import { CardLightboxComponent } from '../cards/card-lightbox/card-lightbox';
import { PackService } from '../services/pack.service';
import { NavComponent } from '../shared/nav/nav';

type Phase = 'sealed' | 'tearing' | 'shaking' | 'torn' | 'erupting' | 'revealing' | 'done';

@Component({
  selector: 'app-pack-opening',
  imports: [NgIf, NgFor, CardComponent, CardLightboxComponent, NavComponent],
  templateUrl: './pack-opening.html',
  styleUrl: './pack-opening.scss',
  animations: [
    // ── Pack slides down and fades when removed ─────────────
    trigger('packAnim', [
      transition(':leave', [
        animate(
          '0.55s ease-in',
          style({ opacity: 0, transform: 'translateY(80px) scale(0.85)' })
        ),
      ]),
    ]),

    // ── Pack shake — builds suspense before the burst ───────
    trigger('packShake', [
      state('idle',    style({ transform: 'none' })),
      state('shaking', style({ transform: 'none' })),
      transition('idle => shaking', [
        animate('1.8s linear', keyframes([
          // Small trembles — something stirring inside
          style({ transform: 'translate(0,0) rotate(0deg)',             offset: 0    }),
          style({ transform: 'translate(-4px,-1px) rotate(-0.8deg)',   offset: 0.04 }),
          style({ transform: 'translate(4px,1px) rotate(0.8deg)',      offset: 0.08 }),
          style({ transform: 'translate(-6px,-2px) rotate(-1.2deg)',   offset: 0.12 }),
          style({ transform: 'translate(6px,2px) rotate(1.2deg)',      offset: 0.16 }),
          // Building intensity
          style({ transform: 'translate(-10px,-3px) rotate(-2deg)',    offset: 0.22 }),
          style({ transform: 'translate(10px,3px) rotate(2deg)',       offset: 0.28 }),
          style({ transform: 'translate(-12px,-4px) rotate(-2.5deg)', offset: 0.34 }),
          style({ transform: 'translate(12px,4px) rotate(2.5deg)',     offset: 0.40 }),
          // Peak
          style({ transform: 'translate(-14px,-4px) rotate(-3deg)',   offset: 0.46 }),
          style({ transform: 'translate(14px,4px) rotate(3deg)',       offset: 0.52 }),
          style({ transform: 'translate(-14px,-4px) rotate(-3deg)',   offset: 0.58 }),
          style({ transform: 'translate(14px,4px) rotate(3deg)',       offset: 0.64 }),
          // Easing back
          style({ transform: 'translate(-10px,-3px) rotate(-2deg)',    offset: 0.72 }),
          style({ transform: 'translate(10px,3px) rotate(2deg)',       offset: 0.80 }),
          style({ transform: 'translate(-6px,-2px) rotate(-1.5deg)',  offset: 0.88 }),
          style({ transform: 'translate(4px,1px) rotate(1deg)',        offset: 0.94 }),
          style({ transform: 'translate(0,0) rotate(0deg)',             offset: 1    }),
        ])),
      ]),
    ]),

    // ── Individual card erupts into the row from below ──────
    trigger('cardErupt', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(200px) scale(0.3) rotateZ({{ rot }}deg)',
        }),
        animate(
          '0.65s {{ delay }}ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          style({
            opacity: 1,
            transform: 'translateY(0) scale(1) rotateZ(0deg)',
          })
        ),
      ], { params: { delay: 0, rot: 0 } }),
    ]),

    // ── Gold glow pulse for rare cards ──────────────────────
    trigger('rareGlow', [
      state('idle', style({ 'box-shadow': '0 0 0 0 transparent' })),
      state('glowing', style({
        'box-shadow': '0 0 20px 8px rgba(240, 200, 64, 0.6)',
      })),
      transition('idle => glowing', [
        animate('0.6s ease-in-out', keyframes([
          style({ 'box-shadow': '0 0 0 0 rgba(240,200,64,0)', offset: 0 }),
          style({ 'box-shadow': '0 0 30px 12px rgba(240,200,64,0.9)', offset: 0.5 }),
          style({ 'box-shadow': '0 0 20px 8px rgba(240,200,64,0.6)', offset: 1 }),
        ])),
      ]),
      transition('glowing => idle', [
        animate('0.3s ease-out', style({
          'box-shadow': '0 0 0 0 transparent',
        })),
      ]),
    ]),

    // ── Parent-level staggered fly-away on Done ─────────────
    trigger('cardsRow', [
      transition('* => fly', [
        query('.card-slot', stagger(80, [
          animate('0.6s cubic-bezier(0.55, 0, 1, 0.45)', style({
            opacity: 0,
            transform: 'translateY(-500px) scale(0.15)',
          })),
        ]), { optional: true }),
      ]),
    ]),

    // ── Done button fade-in ─────────────────────────────────
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.45s ease-out', style({
          opacity: 1,
          transform: 'translateY(0)',
        })),
      ]),
    ]),

    // ── Burst explosion on pack open ────────────────────────
    trigger('burstAnim', [
      transition(':enter', [
        style({ opacity: 1 }),
        animate('1s ease-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class PackOpeningComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly packService = inject(PackService);

  // ── State ──────────────────────────────────────────────────
  readonly phase = signal<Phase>('sealed');
  readonly tearProgress = signal(0);
  readonly cards = signal<Card[]>([]);
  readonly revealedSet = signal(new Set<number>());
  readonly glowingIndex = signal(-1);
  readonly showDone = signal(false);
  readonly flyingAway = signal(false);
  readonly tearCompleting = signal(false);
  readonly isShaking = signal(false);
  readonly selectedCard = signal<Card | null>(null);
  readonly showBurst = signal(false);

  // ── Drag internals ────────────────────────────────────────
  private isTearDragging = false;
  private timers: ReturnType<typeof setTimeout>[] = [];
  private packResultPromise: Promise<void> | null = null;

  // ── Computed ──────────────────────────────────────────────
  readonly showPack = computed(() => {
    const p = this.phase();
    return p === 'sealed' || p === 'tearing' || p === 'shaking' || p === 'torn';
  });

  readonly showCards = computed(() => {
    const p = this.phase();
    return p === 'erupting' || p === 'revealing' || p === 'done';
  });

  readonly lidClipPath = computed(() => {
    const p = this.tearProgress();
    if (p <= 0) return 'none';
    if (p >= 100) return 'polygon(0 0, 0 0, 0 0)';

    // Jagged vertical tear edge — remaining lid is to the right
    const x = p;
    return `polygon(
      ${x + 1.5}% 0%, 100% 0%, 100% 100%, ${x + 1}% 100%,
      ${x - 0.5}% 88%, ${x + 2}% 75%, ${x - 1}% 62%,
      ${x + 1.5}% 50%, ${x - 0.5}% 38%, ${x + 2}% 25%, ${x - 1}% 12%
    )`;
  });

  // ── Lifecycle ─────────────────────────────────────────────
  ngOnDestroy(): void {
    this.timers.forEach((t) => clearTimeout(t));
  }

  // ── Tear gesture ──────────────────────────────────────────
  onTearStart(event: PointerEvent): void {
    const ph = this.phase();
    if (ph !== 'sealed' && ph !== 'tearing') return;
    event.preventDefault();

    const el = event.currentTarget as HTMLElement;
    el.setPointerCapture(event.pointerId);

    this.isTearDragging = true;
    this.phase.set('tearing');
    this.updateTearProgress(event, el);
  }

  onTearMove(event: PointerEvent): void {
    if (!this.isTearDragging) return;
    this.updateTearProgress(event, event.currentTarget as HTMLElement);
  }

  onTearEnd(): void {
    if (!this.isTearDragging) return;
    this.isTearDragging = false;

    if (this.tearProgress() < 80) {
      this.tearProgress.set(0);
      this.phase.set('sealed');
    }
  }

  private updateTearProgress(event: PointerEvent, el: HTMLElement): void {
    const rect = el.getBoundingClientRect();
    const progress = ((event.clientX - rect.left) / rect.width) * 100;
    this.tearProgress.set(Math.max(0, Math.min(100, progress)));

    if (this.tearProgress() >= 80 && !this.isShaking()) {
      this.startShake();
    }
  }

  private startShake(): void {
    this.isTearDragging = false;
    this.phase.set('shaking');
    this.isShaking.set(true);
  }

  // Called by (@packShake.done) in the template
  onShakeDone(): void {
    if (this.phase() !== 'shaking') return;
    this.completeTear();
  }

  private completeTear(): void {
    this.isTearDragging = false;
    this.tearCompleting.set(true);
    this.tearProgress.set(100);
    this.phase.set('torn');
    this.showBurst.set(true);

    // Fire the API now — the 1.5s of torn + erupting covers the network round-trip,
    // and revealCards() will await this before starting the reveal sequence.
    this.packResultPromise = new Promise((resolve, reject) => {
      this.packService.openPack().subscribe({
        next: (result) => {
          this.cards.set(result.cards);
          resolve();
        },
        error: (err) => reject(err),
      });
    });

    this.defer(() => {
      this.phase.set('erupting');

      this.defer(() => {
        this.showBurst.set(false);
        this.phase.set('revealing');
        this.revealCards();
      }, 1000);
    }, 500);
  }

  // ── Card reveal sequence ──────────────────────────────────
  private async revealCards(): Promise<void> {
    // If the API is still in flight, hold the reveal until cards are in hand.
    if (this.packResultPromise) {
      try {
        await this.packResultPromise;
      } catch {
        return;
      }
    }

    const list = this.cards();

    for (let i = 0; i < list.length; i++) {
      const isRare = list[i].rarity === 'rare';

      if (isRare) {
        this.glowingIndex.set(i);
        await this.sleep(800);
      }

      this.revealedSet.update((s) => new Set(s).add(i));

      if (isRare) {
        await this.sleep(700);
        this.glowingIndex.set(-1);
        if (i < list.length - 1) await this.sleep(400);
      } else {
        if (i < list.length - 1) await this.sleep(250);
      }
    }

    await this.sleep(600);
    this.phase.set('done');
    this.showDone.set(true);
  }

  isRevealed(index: number): boolean {
    return this.revealedSet().has(index);
  }

  glowState(index: number): string {
    return this.glowingIndex() === index ? 'glowing' : 'idle';
  }

  // ── Lightbox ───────────────────────────────────────────────
  openLightbox(card: Card, index: number): void {
    if (!this.isRevealed(index)) return;
    this.selectedCard.set(card);
  }

  closeLightbox(): void {
    this.selectedCard.set(null);
  }

  // ── Done ──────────────────────────────────────────────────
  onDone(): void {
    this.flyingAway.set(true);
    this.showDone.set(false);
    this.defer(() => {
      this.router.navigate(['/cards']);
    }, 800);
  }

  // ── Helpers ───────────────────────────────────────────────
  trackById(_: number, card: Card): string {
    return card.id;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      this.timers.push(setTimeout(resolve, ms));
    });
  }

  private defer(fn: () => void, ms: number): void {
    this.timers.push(setTimeout(fn, ms));
  }
}
