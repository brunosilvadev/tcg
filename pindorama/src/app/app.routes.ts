import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing';
import { authGuard } from './auth/auth.guard';
import { firstReleaseGuard, firstReleaseMatch } from './feature-flag.guard';

export const routes: Routes = [
  { path: '', canMatch: [firstReleaseMatch], loadComponent: () => import('./game-landing/landing').then(m => m.LandingComponent) },
  { path: '', component: LandingComponent },
  { path: 'signup',                 loadComponent: () => import('./auth/signup/signup').then(m => m.SignupComponent),                           canActivate: [firstReleaseGuard] },
  { path: 'login',                  loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent),                              canActivate: [firstReleaseGuard] },
  { path: 'home',                   loadComponent: () => import('./home/home').then(m => m.HomeComponent),                                      canActivate: [firstReleaseGuard, authGuard] },
  { path: 'cards',                  loadComponent: () => import('./cards/cards').then(m => m.CardsPageComponent),                               canActivate: [firstReleaseGuard, authGuard] },
  { path: 'pack-opening',           loadComponent: () => import('./pack-opening/pack-opening').then(m => m.PackOpeningComponent),                canActivate: [firstReleaseGuard, authGuard] },
  { path: 'collection/tupinamba',   loadComponent: () => import('./collection/collection-landing').then(m => m.CollectionLandingComponent),      canActivate: [firstReleaseGuard, authGuard] },
  { path: 'profile',                loadComponent: () => import('./profile/profile').then(m => m.ProfileComponent),                             canActivate: [firstReleaseGuard, authGuard] },
  { path: 'commitment',             loadComponent: () => import('./commitment/commitment').then(m => m.CommitmentComponent) },
  { path: '**', redirectTo: '' }
];
