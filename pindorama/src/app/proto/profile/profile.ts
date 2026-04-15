import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavComponent } from '../../shared/nav/nav';

@Component({
  selector: 'app-profile',
  imports: [NavComponent, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent {
  readonly username = 'Adventurer';

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
    // TODO: wire to auth service
    this.passwordStatus.set('success');
    this.passwordError.set('');
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  logout(): void {
    // TODO: wire to auth service
    console.log('logout');
  }
}
