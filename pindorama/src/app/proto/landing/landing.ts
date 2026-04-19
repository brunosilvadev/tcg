import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Card } from '../models/card.model';
import { CardComponent } from '../cards/card/card';
import { ArakuPytxaComponent } from '../../araku-pytxa.component';

interface Particle {
  x: number;
  y: number;
  delay: string;
  duration: string;
}

const HERO_CARDS: Card[] = [
  {
    id: '3', name: 'Caipora', type: 'Spirit', rarity: 'common',
    cardNumber: 3, collectionSize: 45, collection: 'TUP-1: The First Peoples',
    imageUrl: 'https://placehold.co/280x244/141414/9ca3af',
    flavorText: 'Guardian of the hunt, she rides a peccary through the forest night, confounding those who take more than they need.',
  },
  {
    id: '1', name: 'Tupã', type: 'Deity', rarity: 'legendary',
    cardNumber: 1, collectionSize: 45, collection: 'TUP-1: The First Peoples',
    imageUrl: 'https://placehold.co/280x244/2a1500/d4a017',
    flavorText: 'Lord of thunder and the sky, Tupã shaped the earth with lightning and filled the rivers with his tears of rain.',
    artistName: 'M. Cavalcante',
  },
  {
    id: '8', name: 'Anhangá', type: 'Spirit', rarity: 'rare',
    cardNumber: 8, collectionSize: 45, collection: 'TUP-1: The First Peoples',
    imageUrl: 'https://placehold.co/280x244/1a001a/d4a017',
    flavorText: 'The wandering evil. It takes the shape of a white deer with fire-red eyes to lure the doomed deeper into the jungle.',
    artistName: 'L. Ferreira',
  },
];

const SHOWCASE_CARDS: Card[] = [
  {
    id: '9', name: 'Jurupari', type: 'Deity', rarity: 'legendary',
    cardNumber: 9, collectionSize: 45, collection: 'TUP-1: The First Peoples',
    imageUrl: 'https://placehold.co/280x244/1e1b4b/c4b5fd',
    flavorText: 'Lord of the dark rite, keeper of forbidden names. His song drives men to madness; his silence, to death.',
    artistName: 'M. Cavalcante',
  },
  {
    id: '2', name: 'Iara', type: 'Spirit', rarity: 'uncommon',
    cardNumber: 2, collectionSize: 45, collection: 'TUP-1: The First Peoples',
    imageUrl: 'https://placehold.co/280x244/001a0f/52b788',
    flavorText: 'From beneath the dark waters she calls. Those who hear her song seldom find their way back to shore.',
    artistName: 'L. Ferreira',
  },
  {
    id: '4', name: 'Guaracy', type: 'Deity', rarity: 'rare',
    cardNumber: 4, collectionSize: 45, collection: 'TUP-1: The First Peoples',
    imageUrl: 'https://static.wikia.nocookie.net/mythology/images/6/65/Guaraci.jpg',
    flavorText: 'The Sun God watches all beneath him. His gaze is warmth; his anger, drought.',
    artistName: 'M. Cavalcante',
  },
  {
    id: '6', name: 'Curupira', type: 'Creature', rarity: 'common',
    cardNumber: 6, collectionSize: 45, collection: 'TUP-1: The First Peoples',
    imageUrl: 'https://i.pinimg.com/736x/1d/cc/7e/1dcc7ee004fd2569799c03d20408af01.jpg',
    flavorText: 'Its feet point backward to mislead hunters. A child of the forest — fierce, wild, and unforgiving of trespass.',
    artistName: 'R. Nascimento',
  },
  {
    id: '5', name: 'Jaci', type: 'Deity', rarity: 'uncommon',
    cardNumber: 5, collectionSize: 45, collection: 'TUP-1: The First Peoples',
    imageUrl: 'https://placehold.co/280x244/000d1a/52b788',
    flavorText: 'Goddess of the moon, mother of night. She lights the path of travelers and whispers to the tides.',
  },
  {
    id: '7', name: 'Boitatá', type: 'Creature', rarity: 'uncommon',
    cardNumber: 7, collectionSize: 45, collection: 'TUP-1: The First Peoples',
    imageUrl: 'https://placehold.co/280x244/000d1a/52b788',
    flavorText: 'A serpent of living fire, born from the floods of ages past.',
  },
];

@Component({
  selector: 'app-proto-landing',
  imports: [NgFor, RouterLink, CardComponent, ArakuPytxaComponent],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class LandingComponent {
  readonly heroCards = HERO_CARDS;
  readonly showcaseCards = SHOWCASE_CARDS;

  readonly particles: Particle[] = Array.from({ length: 30 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: `${(Math.random() * 8).toFixed(1)}s`,
    duration: `${(6 + Math.random() * 8).toFixed(1)}s`,
  }));
}
