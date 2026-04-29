import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavComponent } from '../shared/nav/nav';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-profile',
  imports: [NavComponent, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly username = this.auth.getUsername() ?? 'Adventurer';

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  readonly passwordStatus = signal<'idle' | 'success' | 'error'>('idle');
  readonly passwordError = signal('');

  changePassword(): void {
    if (this.newPassword.length < 8) {
      this.passwordError.set('New password must be at least 8 characters.');
      this.passwordStatus.set('error');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError.set('Passwords do not match.');
      this.passwordStatus.set('error');
      return;
    }

    this.auth.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: () => {
        this.passwordStatus.set('success');
        this.passwordError.set('');
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: err => {
        const message = err.error?.message ?? 'Something went wrong. Please try again.';
        this.passwordError.set(message);
        this.passwordStatus.set('error');
      },
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
