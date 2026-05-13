# Idea Validator

Webová aplikácia pre tím DIUS na validáciu vizionárskych ideí proti **6-osému rubricu** (alignment s manifestom, technická realizovateľnosť, etika, ekonomika, závislosti, moat). Postavené nad Claude API.

- **Pridávať** vlastné idey cez formulár.
- **Validovať** ideu kliknutím — Claude vráti skóre, summary, ďalší krok.
- **Hodnotiť** hviezdičkami (1–5) a **komentovať** ostatné idey.
- **História** validácií per idea.
- Prístup chránený **zdieľaným kódom** + email pri prvom prihlásení.

## Stack

- **Next.js 14** (App Router) na Vercel
- **Supabase** Postgres
- **Anthropic Claude** API (`claude-sonnet-4-6` default, `claude-opus-4-7` deep mode)
- **Auth**: jednorazový shared code + JWT cookie (`jose`), žiadny OAuth
- **Tailwind** CSS

## Setup — lokálne

```bash
# 1. Install
npm install

# 2. Env
cp .env.example .env.local
# Vyplň hodnoty (viď nižšie).

# 3. Supabase schema
# Otvor Supabase Studio → SQL editor → spusti obsah supabase/migrations/0001_init.sql

# 4. Dev server
npm run dev
# → http://localhost:3000/login
```

## Env vars

| Var | Popis |
|---|---|
| `ANTHROPIC_API_KEY` | https://console.anthropic.com/settings/keys |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project settings → API (anon public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project settings → API (service_role — **server-only**) |
| `ACCESS_CODE` | Zdieľaný prístupový kód pre celý tím. Akýkoľvek string. |
| `SESSION_SECRET` | Min. 32 znakov. `openssl rand -base64 32`. |
| `ALLOWED_DOMAIN` | *(voliteľné)* napr. `dius.ai` — vynúti email z tejto domény pri logine. Nechaj prázdne pre žiadne obmedzenie. |

## Ako funguje auth

1. Užívateľ ide na `/login` a zadá:
   - **Prístupový kód** — jedna zdieľaná hodnota z `ACCESS_CODE`.
   - **Svoj email** — voliteľne validovaný proti `ALLOWED_DOMAIN`.
2. Server overí kód, podpíše JWT s emailom (HS256 + `SESSION_SECRET`), uloží do HttpOnly cookie na 30 dní.
3. `middleware.ts` overuje cookie pri každom requeste mimo `/login` a `/api/auth/*`.
4. Identita kolegu = čo si zadal pri logine. **Žiadna verifikácia emailu** — funguje na honor system. Pre interný tím 5–20 ľudí to stačí. Ak budeš potrebovať silnejšiu identitu, prejdi na magic link (Supabase Auth).

**Rotácia kódu:** ak chceš pozvať kolegu, len mu pošli kód. Ak ho chceš revoknúť, zmeň `ACCESS_CODE` v Verceli — existujúce session-y zostanú platné, kým neexpirujú alebo nezmeníš aj `SESSION_SECRET`.

## Deploy — Vercel

```bash
# 1. Push na GitHub
git init && git add . && git commit -m "init"
git remote add origin git@github.com:<user>/idea-validator-web.git
git push -u origin main

# 2. Vercel
# → vercel.com → Add New → Project → import z GitHubu
# → Framework preset: Next.js (autodetect)
# → Settings → Environment Variables: pridaj všetky z .env.example
# → Deploy
```

Nie je potrebný Google OAuth, žiadne redirect URI, žiadny separátny auth provider setup.

## Architektúra

```
app/
├── api/
│   ├── auth/login           POST {code, email} → set cookie
│   ├── auth/logout          POST → clear cookie
│   ├── ideas/               GET list, POST create
│   ├── ideas/[id]/          GET/PATCH/DELETE (autor-only)
│   ├── ideas/[id]/ratings/  PUT/DELETE (1 rating per user)
│   ├── ideas/[id]/comments/ POST
│   ├── comments/[id]/       DELETE (autor-only)
│   └── validate/[id]/       POST → zavolá Claude, uloží report
├── ideas/new/               Formulár pridať
├── ideas/[id]/              Detail (telo, report, history, ratings, comments)
├── ideas/[id]/edit/         Edit (autor-only)
├── reports/                 Tabuľka ideí zoradená podľa skóre
└── login/                   Sign-in stránka

lib/
├── db.ts          Supabase clients + types (lazy init)
├── anthropic.ts   Claude SDK wrapper (validateIdea)
├── rubric.ts      System prompt + váhy + weightedScore()
├── auth.ts        Cookie session helpers (jose JWT)
└── api-error.ts   Zdieľaný error response helper

middleware.ts      Kontroluje JWT cookie na všetkých chránených routes

supabase/migrations/0001_init.sql
                   ideas, validation_reports, ratings, comments + view
```

## Bezpečnosť

- **Service role key** sa používa iba server-side (`lib/db.ts → supabaseAdmin()` throwne ak ho zavoláš v browseri).
- **RLS na Supabase nie je nastavené** — všetky kontroly (autor-only, prístupový kód) sa robia v Next.js API routes. Ak chceš belt-and-suspenders, doplň RLS politiky neskôr.
- **`ACCESS_CODE` porovnanie** robí constant-time compare (žiadny timing leak).
- **`ANTHROPIC_API_KEY`** je server-only env var, nikdy nejde do clienta.
- **Honor-system identita**: kolega môže pri logine napísať čokoľvek do email poľa. Pre interný tím v poriadku, ale neopieraj o to audit log.

## Náklady

- **Vercel:** Hobby tier zdarma (stačí pre ~10 ľudí).
- **Supabase:** Free tier (500 MB DB, 5 GB bandwidth).
- **Claude API:** ~$0.003–0.015 za validáciu (Sonnet 4.6). Opus deep mode ~5× drahší.

## Roadmap

- [ ] Wikilink `[[Idea - X]]` rendering v komentároch a tele
- [ ] Export reportu ako markdown (kompatibilný s Obsidian)
- [ ] Magic link upgrade ak budeš potrebovať silnejšiu identitu
- [ ] Streaming validácie (Vercel Edge runtime) — UX feedback počas Claude call
