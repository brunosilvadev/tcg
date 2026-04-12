export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary';

export interface Card {
  id: number;
  name: string;
  type: string;
  rarity: Rarity;
  cardNumber: number;
  collectionSize: number;
  collection: string;
  imageUrl: string;
  flavorText: string;
  artistName?: string;
}
