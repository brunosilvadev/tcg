import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavComponent } from '../../shared/nav/nav';

export interface CollectionInfo {
  eyebrow:    string;
  name:       string;
  subtitle:   string;
  totalCards: number;
  owned:      number;
  rarities: Array<{
    label: string;
    owned: number;
    total: number;
    type:  string;
  }>;
}

const TUPINAMBA: CollectionInfo = {
  eyebrow:    'Pindorama · Coleção I',
  name:       'Tupinambá',
  subtitle:   'Povo da costa atlântica',
  totalCards: 36,
  owned:      24,
  rarities: [
    { label: 'Common',   owned: 16, total: 20, type: 'common'   },
    { label: 'Uncommon', owned: 7,  total: 10, type: 'uncommon' },
    { label: 'Rare',     owned: 1,  total: 6,  type: 'rare'     },
  ],
};

@Component({
  selector:    'app-collection-landing',
  standalone:  true,
  imports:     [RouterLink, NavComponent],
  templateUrl: './collection-landing.html',
  styleUrl:    './collection-landing.scss',
})
export class CollectionLandingComponent {
  @Input() collection: CollectionInfo = TUPINAMBA;

  readonly particles = [
    { left: '8%',  delay: '0s',   dur: '10s', isGold: true  },
    { left: '19%', delay: '2.4s', dur: '13s', isGold: false },
    { left: '31%', delay: '1.1s', dur: '9s',  isGold: true  },
    { left: '46%', delay: '3.9s', dur: '12s', isGold: false },
    { left: '57%', delay: '0.7s', dur: '8s',  isGold: true  },
    { left: '69%', delay: '2.8s', dur: '14s', isGold: false },
    { left: '81%', delay: '1.6s', dur: '11s', isGold: true  },
    { left: '92%', delay: '4.3s', dur: '9s',  isGold: false },
  ];

  get progress(): number {
    return (this.collection.owned / this.collection.totalCards) * 100;
  }
}
