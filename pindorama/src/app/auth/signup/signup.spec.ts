import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { AuthService } from '../auth.service';
import { SignupComponent } from './signup';
import { GemsService } from '../../services/gems.service';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let authService: { signup: ReturnType<typeof vi.fn> };
  let gemsService: { applyLoginResult: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    authService = { signup: vi.fn() };
    gemsService = { applyLoginResult: vi.fn() };

    authService.signup.mockReturnValue(of({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      expiresAt: '2099-01-01T00:00:00Z',
    }));

    await TestBed.configureTestingModule({
      imports: [SignupComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
        { provide: GemsService, useValue: gemsService },
      ],
    }).compileComponents();

    component = TestBed.createComponent(SignupComponent).componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
  });

  it('navigates to pack opening after a successful signup', () => {
    component.email = '  player@example.com  ';
    component.username = '  player_one  ';
    component.password = 'password123';
    component.confirmPassword = 'password123';

    component.onSubmit(new Event('submit'));

    expect(authService.signup).toHaveBeenCalledWith('player@example.com', 'player_one', 'password123');
    expect(gemsService.applyLoginResult).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/pack-opening');
  });
});
