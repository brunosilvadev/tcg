import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing';
import { firstReleaseGuard } from './feature-flag.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'signup', loadComponent: () => import('./auth/signup/signup').then(m => m.SignupComponent), canActivate: [firstReleaseGuard] },
  { path: 'login', loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent), canActivate: [firstReleaseGuard] },
  // To promote proto to root: change 'proto' to '' and remove the LandingComponent route above
  { path: 'proto', loadChildren: () => import('./proto/proto.routes').then(m => m.PROTO_ROUTES), canActivate: [firstReleaseGuard] },
  { path: 'commitment', loadComponent: () => import('./commitment/commitment').then(m => m.CommitmentComponent), canActivate: [firstReleaseGuard] },
  { path: '**', redirectTo: '' }
];
