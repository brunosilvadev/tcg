import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

const TOKEN_SKIP_PATHS = ['/auth/login', '/auth/register', '/auth/refresh'];
// 401s from the login/register forms should surface as form errors, not redirects.
const REDIRECT_SKIP_PATHS = ['/auth/login', '/auth/register'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const auth = inject(AuthService);
  const router = inject(Router);

  const skipTokenAttach = TOKEN_SKIP_PATHS.some(
    path => req.url.startsWith(`${environment.apiUrl}${path}`),
  );
  const skipRedirect = REDIRECT_SKIP_PATHS.some(
    path => req.url.startsWith(`${environment.apiUrl}${path}`),
  );

  let outgoing = req;
  if (!skipTokenAttach) {
    const token = auth.getAccessToken();
    if (token) {
      outgoing = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
  }

  return next(outgoing).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse && err.status === 401 && !skipRedirect) {
        auth.logout();
        router.navigateByUrl('/login');
      }
      return throwError(() => err);
    }),
  );
};
