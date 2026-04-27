import { routes } from './app.routes';
import { firstReleaseGuard } from './feature-flag.guard';

describe('routes', () => {
  it('keeps the commitment route accessible without the first-release guard', () => {
    const route = routes.find(candidate => candidate.path === 'commitment');

    expect(route).toBeDefined();
    expect(route?.canActivate).toBeUndefined();
  });

  it('keeps other gated routes behind the first-release guard', () => {
    const route = routes.find(candidate => candidate.path === 'signup');

    expect(route).toBeDefined();
    expect(route?.canActivate).toEqual([firstReleaseGuard]);
  });
});
