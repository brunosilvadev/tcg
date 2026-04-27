import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { LdService } from './ld.service';

export const firstReleaseGuard: CanActivateFn = () => {
  const ld = inject(LdService);
  const router = inject(Router);
  return ld.firstRelease() ? true : router.parseUrl('/');
};

export const firstReleaseMatch: CanMatchFn = () => inject(LdService).firstRelease();
