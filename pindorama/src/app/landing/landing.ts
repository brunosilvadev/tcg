import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WaitlistService } from '../waitlist';
import { ArakuPytxaComponent } from '../araku-pytxa.component';

interface Particle {
  x: number;
  y: number;
  delay: string;
  duration: string;
}

@Component({
  selector: 'app-landing',
  imports: [CommonModule, FormsModule, ArakuPytxaComponent],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class LandingComponent {
  email = '';
  notified = false;
  submitting = false;
  error = '';

  particles: Particle[] = Array.from({ length: 30 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: `${(Math.random() * 8).toFixed(1)}s`,
    duration: `${(6 + Math.random() * 8).toFixed(1)}s`,
  }));

  constructor(private waitlist: WaitlistService) {}

  private isValidEmail(value: string): boolean {
    if (!value || value.length > 254) return false;
    // RFC 5321 compliant whitelist regex — only printable ASCII, no scripts
    return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(value);
  }

  onNotify(event: Event): void {
    event.preventDefault();
    if (this.submitting) return;

    const email = this.email.trim();

    if (!this.isValidEmail(email)) {
      this.error = 'Please enter a valid email address.';
      return;
    }

    this.submitting = true;
    this.error = '';

    this.waitlist.join(email).subscribe({
      next: () => {
        this.notified = true;
        this.email = '';
        this.submitting = false;
      },
      error: () => {
        this.error = 'Something went wrong. Please try again.';
        this.submitting = false;
      }
    });
  }
}
