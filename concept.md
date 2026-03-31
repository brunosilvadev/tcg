# Pindorama — Game Design Concept

## Vision

Pindorama is a free-to-play virtual trading card game that celebrates the mythology, deities, and rituals of indigenous South American peoples. The game aims to be visually stunning, culturally respectful, and mechanically satisfying through a dopamine-driven collection loop.

---

## Theme

### First Collection: Tupi Mythology
The inaugural card set draws from Tupi-Guarani cosmology — one of the most widespread indigenous cultural groups of South America. Cards will feature:

- Major deities (e.g. Tupã, Jurupari, Iara, Caipora)
- Sacred animals and spirit guides
- Ritual ceremonies and cultural artifacts
- Mythological events and creation stories

Future collections may expand to other South American peoples (Quechua, Aymara, Mapuche, etc.) or other indigenous American cultures.

---

## Cards

### Rarity Tiers
Each card belongs to one rarity tier, which affects how frequently it appears in booster packs:

| Rarity   | Color Code | Drop Rate (per pack slot) |
|----------|------------|---------------------------|
| Common   | Gray       | ~75%                      |
| Uncommon | Green      | ~20%                      |
| Rare     | Gold       | ~5%                       |

### Card Anatomy
Each card contains:
- **Name** — the deity, creature, or artifact name
- **Type** — card category (see below)
- **Rarity** — Common / Uncommon / Rare
- **Art** — AI-generated illustration in a consistent visual style
- **Flare Text** — a short evocative phrase or title
- **Lore Blurb** — 2–4 sentences of narrative or mythological background
- **Collection Number** — e.g. 042 / 120

### Card Types
Cards are categorized into types to give them identity and potential future gameplay use:

- **Deity** — gods and divine beings
- **Spirit** — nature spirits, ancestral entities
- **Creature** — sacred animals and mythological beasts
- **Ritual** — ceremonies, dances, and sacred practices
- **Artifact** — tools, weapons, and cultural objects
- **Land** — sacred places, rivers, forests

---

## Booster Packs

Each booster pack contains **5 cards**:
- 3 Commons
- 1 Uncommon
- 1 Rare (guaranteed)

### Opening Experience
Opening a pack should feel rewarding and cinematic:
1. Animated pack appears on screen
2. User clicks/taps to "tear" it open
3. Cards are revealed one by one with satisfying animations
4. Rare cards trigger a special visual effect (glow, particles, sound)
5. New cards are highlighted; duplicates are noted

---

## Collection

### Collection Display
- Grid layout showing all cards in the set
- Cards the user **owns** appear in full color
- Cards the user **does not own** appear as dark silhouettes with a "?" or shadowed art
- Hovering/clicking a card shows its details if owned
- A completion counter shows progress (e.g. "47 / 120 cards")

### Duplicates
Users can accumulate multiple copies of the same card. Duplicates are tracked and may be used in a future trading or crafting system.

---

## Progression & Rewards

### Point System
Users earn **Pindorama Points (PP)** through simple engagement tasks:

| Task                    | Points |
|-------------------------|--------|
| Daily login             | 10 PP  |
| Consecutive day streak  | +5 PP/day bonus |
| Watching/clicking an ad | 5 PP   |
| First login of the week | 20 PP  |

Points accumulate and are spent to unlock booster packs.

| Pack Cost |
|-----------|
| 50 PP per booster pack |

This is subject to balancing. The goal is that a daily-login user can open roughly 1 pack every 3–5 days.

---

## User Accounts

- Authentication via **Google OAuth 2.0** — no password management needed
- Each user has a profile with:
  - Display name and avatar (from Google)
  - Current point balance
  - Collection progress
  - Pack opening history

---

## Future Features (Post-MVP)

- **Trading** — list cards for trade, browse offers, accept/reject
- **Crafting** — convert duplicates into crafting material to craft a specific card
- **Expansions** — new card sets with new cultural themes
- **Leaderboards** — most complete collections, fastest completions
- **Achievements** — unlock badges for milestones
- **Card showcase** — let users display a featured card on their profile

---

## Content Creation Guidelines

- Art should be generated with a consistent, painterly style (e.g. watercolor or digital oil)
- All lore text should be reviewed for cultural accuracy and respect
- Card names should use the original indigenous language name where possible, with a subtitle translation
- Each card's lore blurb should cite or be inspired by documented mythology, not invented
