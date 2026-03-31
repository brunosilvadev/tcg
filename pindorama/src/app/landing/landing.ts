import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Particle {
  x: number;
  y: number;
  delay: string;
  duration: string;
}

@Component({
  selector: 'app-landing',
  imports: [CommonModule, FormsModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class LandingComponent {
  email = '';
  notified = false;

  particles: Particle[] = Array.from({ length: 30 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: `${(Math.random() * 8).toFixed(1)}s`,
    duration: `${(6 + Math.random() * 8).toFixed(1)}s`,
  }));

  onNotify(event: Event): void {
    event.preventDefault();
    if (this.email) {
      this.notified = true;
      this.email = '';
    }
  }
}
