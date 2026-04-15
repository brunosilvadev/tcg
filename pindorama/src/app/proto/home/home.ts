import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Card } from '../models/card.model';
import { CardComponent } from '../cards/card/card';
import { NavComponent } from '../../shared/nav/nav';

@Component({
  selector: 'app-home',
  imports: [NgFor, MatProgressBarModule, CardComponent, NavComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  readonly username = 'Adventurer';

  readonly collection = {
    name: 'Collection I · Tupinambá',
    owned: 24,
    total: 36,
    missing: 12,
    progress: (24 / 36) * 100,
    rarities: [
      { label: 'Common',   rarity: 'common',   owned: 8,  total: 12 },
      { label: 'Uncommon', rarity: 'uncommon',  owned: 10, total: 14 },
      { label: 'Rare',     rarity: 'rare',      owned: 6,  total: 10 },
    ],
  };

  readonly booster = {
    streakDays: 7,
    streakGoalDays: 10,
    streakProgress: 70,
    daysToNextPack: 3,
    tasks: [
      { label: 'Logged in today', done: true  },
      { label: 'Viewed a card',   done: true  },
      { label: 'Open a pack',     done: false },
    ],
  };

  readonly bestCard: Card = {
    id: 1,
    name: 'Tupã',
    type: 'Deity',
    rarity: 'rare',
    cardNumber: 1,
    collectionSize: 45,
    collection: 'TUP-1: The First Peoples',
    imageUrl: 'https://placehold.co/280x244/2a1500/d4a017',
    flavorText: 'Lord of thunder and the sky, Tupã shaped the earth with lightning and filled the rivers with his tears of rain.',
    artistName: 'M. Cavalcante',
  };

  readonly factOfDay = {
    text: 'The Tupinambá were one of the most widespread indigenous peoples of coastal Brazil, known for their fierce resistance to colonization and the rich oral traditions that shaped Brazilian folklore for centuries.',
    tag: 'Culture',
  };
}
