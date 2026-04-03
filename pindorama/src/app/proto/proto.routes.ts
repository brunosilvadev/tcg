import { Routes } from '@angular/router';
import { ProtoHome } from './proto-home/proto-home';
import { CardsPageComponent } from './cards/cards';

export const PROTO_ROUTES: Routes = [
  { path: '',      component: ProtoHome },
  { path: 'cards', component: CardsPageComponent },
];
