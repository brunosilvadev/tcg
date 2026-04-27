import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing';
import { firstReleaseGuard } from './feature-flag.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'signup',                 loadComponent: () => import('./auth/signup/signup').then(m => m.SignupComponent),                           canActivate: [firstReleaseGuard] },
  { path: 'login',                  loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent),                              canActivate: [firstReleaseGuard] },
  { path: 'home',                   loadComponent: () => import('./home/home').then(m => m.HomeComponent),                                canActivate: [firstReleaseGuard] },
  { path: 'cards',                  loadComponent: () => import('./cards/cards').then(m => m.CardsPageComponent),                         canActivate: [firstReleaseGuard] },
  { path: 'pack-opening',           loadComponent: () => import('./pack-opening/pack-opening').then(m => m.PackOpeningComponent),          canActivate: [firstReleaseGuard] },
  { path: 'collection/tupinamba',   loadComponent: () => import('./collection/collection-landing').then(m => m.CollectionLandingComponent), canActivate: [firstReleaseGuard] },
  { path: 'profile',                loadComponent: () => import('./profile/profile').then(m => m.ProfileComponent),                       canActivate: [firstReleaseGuard] },
  { path: 'landing',                loadComponent: () => import('./game-landing/landing').then(m => m.LandingComponent),                   canActivate: [firstReleaseGuard] },
  { path: 'commitment',             loadComponent: () => import('./commitment/commitment').then(m => m.CommitmentComponent),                     canActivate: [firstReleaseGuard] },
  { path: '**', redirectTo: '' }
];
