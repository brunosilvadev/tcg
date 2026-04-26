import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WaitlistService } from '../waitlist';
import { ArakuPytxaComponent } from '../araku-pytxa.component';
import { FooterComponent } from '../shared/footer/footer';
import { NotificationService } from '../shared/notification.service';

interface Particle {
  x: number;
  y: number;
  delay: string;
  duration: string;
}

@Component({
  selector: 'app-landing',
  imports: [CommonModule, FormsModule, ArakuPytxaComponent, FooterComponent],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class LandingComponent {
  email = '';
  readonly notified = signal(false);
  readonly submitting = signal(false);
  readonly error = signal('');

  particles: Particle[] = Array.from({ length: 30 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: `${(Math.random() * 8).toFixed(1)}s`,
    duration: `${(6 + Math.random() * 8).toFixed(1)}s`,
  }));

  constructor(private waitlist: WaitlistService, private notify: NotificationService) {}

  private isValidEmail(value: string): boolean {
    if (!value || value.length > 254) return false;
    // RFC 5321 compliant whitelist regex — only printable ASCII, no scripts
    return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(value);
  }

  onNotify(event: Event): void {
    event.preventDefault();
    if (this.submitting()) return;

    const email = this.email.trim();

    if (!this.isValidEmail(email)) {
      this.error.set('Please enter a valid email address.');
      return;
    }

    this.submitting.set(true);
    this.error.set('');

    this.waitlist.join(email).subscribe({
      next: () => {
        this.notified.set(true);
        this.email = '';
        this.submitting.set(false);
        this.notify.show('success', 'You\'re on the list! We\'ll be in touch.');
      },
      error: () => {
        this.error.set('Something went wrong. Please try again.');
        this.submitting.set(false);
        this.notify.show('error', 'Something went wrong. Please try again.');
      }
    });
  }
}
