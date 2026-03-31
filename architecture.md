# Pindorama — Technical Architecture

## Overview

Pindorama is a web application with a clear separation between frontend, backend API, and database. Authentication is delegated to Google. Card images are stored externally (Azure Blob Storage or similar). All components are hosted on Azure.

---

## Stack

| Layer        | Technology              |
|--------------|-------------------------|
| Frontend     | Angular (SPA)           |
| Backend      | .NET Web API (C#)       |
| Database     | PostgreSQL               |
| Auth         | Google OAuth 2.0        |
| Image Storage| Azure Blob Storage      |
| Hosting      | Azure App Service       |
| CI/CD        | GitHub Actions (TBD)    |

---

## Authentication

- Users sign in with **Google OAuth 2.0**
- The Angular app initiates the OAuth flow and receives a Google ID token
- The .NET API validates the token against Google's public keys
- On first login, a user record is created in the database
- The API issues its own **JWT** for subsequent authenticated requests

---

## Frontend (Angular)

### Key Pages / Views
- **Login** — Google sign-in button, landing/splash screen
- **Collection** — full card grid, owned vs. missing states, filter by type/rarity
- **Pack Opening** — animated pack reveal experience
- **Profile** — point balance, collection stats, pack history

### Key Behaviors
- Collection grid shows silhouettes for unowned cards
- Pack opening is an animated sequence; no page reload
- Points balance and pack availability are visible in the nav/header
- Google login handled via Angular OAuth2 library (e.g. `angular-oauth2-oidc`)

---

## Backend (.NET Web API)

### API Structure
RESTful API organized around resources:

```
POST   /auth/google            — Validate Google token, return JWT
GET    /users/me               — Get current user profile
GET    /users/me/collection    — Get user's collected cards
GET    /users/me/points        — Get current point balance
POST   /users/me/tasks/daily   — Complete daily login task, award points
POST   /packs/open             — Spend points, open a pack, return cards
GET    /cards                  — List all cards in the set (for collection grid)
GET    /cards/{id}             — Get a single card's details
```

### Pack Opening Logic
1. Verify user has enough points
2. Deduct points atomically
3. Run weighted random draw: 3 Commons, 1 Uncommon, 1 Rare
4. Insert results into `user_cards`
5. Return the 5 drawn cards to the frontend

### Task / Points Logic
- Daily login task is idempotent per calendar day (UTC)
- Streak is tracked; consecutive days grant a bonus
- Each task type is defined in a config/table to allow easy tuning

---

## Database (PostgreSQL)

### Schema

```sql
-- Users
users (
  id UUID PRIMARY KEY,
  google_id TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  login_streak INTEGER DEFAULT 0
)

-- Cards (static catalog)
cards (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  name_translation TEXT,
  type TEXT NOT NULL,          -- Deity, Spirit, Creature, Ritual, Artifact, Land
  rarity TEXT NOT NULL,        -- Common, Uncommon, Rare
  flare_text TEXT,
  lore_blurb TEXT,
  image_url TEXT,
  collection_number INTEGER,
  set_code TEXT DEFAULT 'TUP1'
)

-- User collection (includes duplicates)
user_cards (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  card_id UUID REFERENCES cards(id),
  obtained_at TIMESTAMPTZ,
  from_pack_id UUID            -- which pack opening granted this
)

-- Pack opening history
pack_openings (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  opened_at TIMESTAMPTZ,
  points_spent INTEGER
)

-- Task completion log
task_completions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  task_type TEXT NOT NULL,     -- daily_login, ad_click, etc.
  completed_at TIMESTAMPTZ,
  points_awarded INTEGER
)
```

---

## Card Images

- Images are pre-generated with an AI image tool (e.g. Midjourney, DALL-E, Stable Diffusion)
- Uploaded to **Azure Blob Storage** with a public CDN URL
- `image_url` on the `cards` table points to the CDN URL
- The API never proxies images — the frontend fetches them directly from the CDN

---

## Deployment (Azure)

| Component      | Azure Service              |
|----------------|----------------------------|
| Frontend SPA   | Azure Static Web Apps      |
| .NET API       | Azure App Service          |
| Database       | Azure Database for PostgreSQL (Flexible Server) |
| Images         | Azure Blob Storage + CDN   |

---

## Security Considerations

- All API endpoints (except `/auth/google`) require a valid JWT
- Pack opening and task completion use database transactions to prevent double-spending points
- Google token validation must check `aud` (audience) and `exp` (expiry)
- Image URLs are public/read-only; no user-uploaded content

---

## Development Phases

### Phase 1 — MVP
- Google login
- Static card catalog (first set, seeded in DB)
- Collection display with silhouettes
- Daily login task
- Pack opening (weighted random, animated)

### Phase 2 — Engagement
- Ad-based point earning
- Streak bonuses
- Pack opening history

### Phase 3 — Social
- Card trading system
- User profiles / showcases
- Leaderboards

### Phase 4 — Expansion
- Second card set (new cultural theme)
- Crafting / duplicate conversion
