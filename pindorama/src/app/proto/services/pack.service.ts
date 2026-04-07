import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Card } from '../models/card.model';

export interface PackOpeningResult {
  packId: string;
  setName: string;
  cards: Card[];
}

const BOOSTER_CARDS: Card[] = [
  {
    id: 3,
    name: 'Caipora',
    type: 'Spirit',
    rarity: 'common',
    cardNumber: 3,
    collectionSize: 45,
    collection: 'TUP-1: The First Peoples',
    imageUrl: 'https://placehold.co/280x244/141414/9ca3af',
    flavorText:
      'Guardian of the hunt, she rides a peccary through the forest night, confounding those who take more than they need.',
  },
  {
    id: 5,
    name: 'Jaci',
    type: 'Deity',
    rarity: 'uncommon',
    cardNumber: 5,
    collectionSize: 45,
    collection: 'TUP-1: The First Peoples',
    imageUrl: 'https://placehold.co/280x244/000d1a/52b788',
    flavorText:
      'Goddess of the moon, mother of night. She lights the path of travelers and whispers to the tides.',
  },
  {
    id: 6,
    name: 'Curupira',
    type: 'Creature',
    rarity: 'common',
    cardNumber: 6,
    collectionSize: 45,
    collection: 'TUP-1: The First Peoples',
    imageUrl: 'https://i.pinimg.com/736x/1d/cc/7e/1dcc7ee004fd2569799c03d20408af01.jpg',
    flavorText:
      'Its feet point backward to mislead hunters. A child of the forest — fierce, wild, and unforgiving of trespass.',
    artistName: 'R. Nascimento',
  },
  {
    id: 2,
    name: 'Iara',
    type: 'Spirit',
    rarity: 'uncommon',
    cardNumber: 2,
    collectionSize: 45,
    collection: 'TUP-1: The First Peoples',
    imageUrl: 'https://placehold.co/280x244/001a0f/52b788',
    flavorText:
      'From beneath the dark waters she calls. Those who hear her song seldom find their way back to shore.',
    artistName: 'L. Ferreira',
  },
  {
    id: 1,
    name: 'Tupã',
    type: 'Deity',
    rarity: 'rare',
    cardNumber: 1,
    collectionSize: 45,
    collection: 'TUP-1: The First Peoples',
    imageUrl: 'https://placehold.co/280x244/2a1500/d4a017',
    flavorText:
      'Lord of thunder and the sky, Tupã shaped the earth with lightning and filled the rivers with his tears of rain.',
    artistName: 'M. Cavalcante',
  },
];

@Injectable({ providedIn: 'root' })
export class PackService {
  openPack(packId: string): Observable<PackOpeningResult> {
    return of({
      packId,
      setName: 'TUP-1: The First Peoples',
      cards: BOOSTER_CARDS,
    }).pipe(delay(200));
  }
}
