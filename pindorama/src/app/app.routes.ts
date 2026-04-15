import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'signup', loadComponent: () => import('./auth/signup/signup').then(m => m.SignupComponent) },
  // To promote proto to root: change 'proto' to '' and remove the LandingComponent route above
  { path: 'proto', loadChildren: () => import('./proto/proto.routes').then(m => m.PROTO_ROUTES) },
  { path: 'commitment', loadComponent: () => import('./commitment/commitment').then(m => m.CommitmentComponent) },
  { path: '**', redirectTo: '' }
];
