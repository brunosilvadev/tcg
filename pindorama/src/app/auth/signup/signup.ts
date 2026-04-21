import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { GemsService } from '../../proto/services/gems.service';
import { ArakuPytxaComponent } from '../../araku-pytxa.component';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterLink, ArakuPytxaComponent],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class SignupComponent {
  private readonly auth = inject(AuthService);
  private readonly gems = inject(GemsService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  confirmPassword = '';

  readonly submitted = signal(false);
  readonly submitting = signal(false);
  readonly serverError = signal('');

  get emailError(): string {
    if (!this.submitted()) return '';
    if (!this.email.trim()) return 'Email is required.';
    if (!/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(this.email.trim()))
      return 'Enter a valid email address.';
    return '';
  }

  get passwordError(): string {
    if (!this.submitted()) return '';
    if (!this.password) return 'Password is required.';
    if (this.password.length < 8) return 'Password must be at least 8 characters.';
    return '';
  }

  get confirmError(): string {
    if (!this.submitted()) return '';
    if (!this.confirmPassword) return 'Please confirm your password.';
    if (this.confirmPassword !== this.password) return 'Passwords do not match.';
    return '';
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.submitted.set(true);
    this.serverError.set('');

    if (this.emailError || this.passwordError || this.confirmError) return;

    this.submitting.set(true);

    const email = this.email.trim();
    const username = email.split('@')[0];

    this.auth.signup(email, username, this.password).subscribe({
      next: res => {
        this.gems.applyLoginResult(res);
        this.router.navigateByUrl('/proto/home');
      },
      error: () => {
        this.serverError.set('Something went wrong. Please try again.');
        this.submitting.set(false);
      },
    });
  }
}
