export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary';

export interface Card {
  id: string;
  name: string;
  type: string;
  rarity: Rarity;
  cardNumber: number;
  collectionSize: number;
  collection: string;
  imageUrl: string;
  flavorText: string;
  artistName?: string;
  isRepeat?: boolean;
}

// ── API shape ────────────────────────────────────────────────
export interface ApiCard {
  id: string;
  collectionId?: string;
  collectionName?: string;
  collection?: { id: string; name: string; totalCards?: number };
  number: number;
  name: string;
  type: string | number;
  rarity: string | number;
  flavorText?: string | null;
  artUrl?: string | null;
  artistCredit?: string | null;
  isRepeat?: boolean;
}

const CARD_TYPE_BY_INDEX = ['Deity', 'Spirit', 'Creature', 'Ritual', 'Place', 'Artifact', 'Person'];
const RARITY_BY_INDEX: Rarity[] = ['common', 'uncommon', 'rare', 'legendary'];

const PLACEHOLDER_IMAGE = 'https://placehold.co/280x244/141414/9ca3af';

export interface MapCardContext {
  collectionName?: string;
  collectionSize?: number;
}

export function mapApiCard(api: ApiCard, ctx: MapCardContext = {}): Card {
  const type = typeof api.type === 'number'
    ? CARD_TYPE_BY_INDEX[api.type] ?? 'Creature'
    : String(api.type);

  const rarity = typeof api.rarity === 'number'
    ? RARITY_BY_INDEX[api.rarity] ?? 'common'
    : (String(api.rarity).toLowerCase() as Rarity);

  const collection = ctx.collectionName ?? api.collectionName ?? api.collection?.name ?? '';
  // TODO: replace with the real collection size once the API returns it on card list/detail.
  const collectionSize = ctx.collectionSize ?? api.collection?.totalCards ?? 36;

  return {
    id: api.id,
    name: api.name,
    type,
    rarity,
    cardNumber: api.number,
    collectionSize,
    collection,
    imageUrl: api.artUrl ?? PLACEHOLDER_IMAGE,
    flavorText: api.flavorText ?? '',
    artistName: api.artistCredit ?? undefined,
    isRepeat: api.isRepeat,
  };
}
