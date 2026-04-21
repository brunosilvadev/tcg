import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { GemsService } from '../../proto/services/gems.service';
import { ArakuPytxaComponent } from '../../araku-pytxa.component';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, ArakuPytxaComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly gems = inject(GemsService);
  private readonly router = inject(Router);

  email = '';
  password = '';

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
    return '';
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.submitted.set(true);
    this.serverError.set('');

    if (this.emailError || this.passwordError) return;

    this.submitting.set(true);

    this.auth.login(this.email.trim(), this.password).subscribe({
      next: res => {
        this.gems.applyLoginResult(res);
        this.router.navigateByUrl('/proto/home');
      },
      error: () => {
        this.serverError.set('Invalid email or password.');
        this.submitting.set(false);
      },
    });
  }
}
