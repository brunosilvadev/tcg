import { Routes } from '@angular/router';
import { ProtoHome } from './proto-home/proto-home';
import { CardsPageComponent } from './cards/cards';
import { PackOpeningComponent } from './pack-opening/pack-opening';
import { HomeComponent } from './home/home';
import { CollectionLandingComponent } from './collection/collection-landing';

export const PROTO_ROUTES: Routes = [
  { path: '',                          component: ProtoHome },
  { path: 'home',                      component: HomeComponent },
  { path: 'cards',                     component: CardsPageComponent },
  { path: 'pack-opening',              component: PackOpeningComponent },
  { path: 'collection/tupinamba',      component: CollectionLandingComponent },
];
