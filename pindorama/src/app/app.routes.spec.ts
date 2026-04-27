import { routes } from './app.routes';
import { authGuard } from './auth/auth.guard';
import { firstReleaseGuard } from './feature-flag.guard';

describe('routes', () => {
  it('keeps the commitment route accessible without the first-release guard', () => {
    const route = routes.find(candidate => candidate.path === 'commitment');

    expect(route).toBeDefined();
    expect(route?.canActivate).toBeUndefined();
  });

  it('keeps auth pages behind the first-release guard only', () => {
    const route = routes.find(candidate => candidate.path === 'signup');

    expect(route).toBeDefined();
    expect(route?.canActivate).toEqual([firstReleaseGuard]);
  });

  it('protects in-app routes with the first-release and auth guards', () => {
    const route = routes.find(candidate => candidate.path === 'home');

    expect(route).toBeDefined();
    expect(route?.canActivate).toEqual([firstReleaseGuard, authGuard]);
  });
});
