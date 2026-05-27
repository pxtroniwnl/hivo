# Hivo — Backend Context

A handoff document describing what the **Hivo** prototype is, what it does, and what a backend has to support to make this a real product.

---

## 1. Product Overview

**Hivo** is an iOS-first strength-training app. It competes with Hevy by adding two things on top of standard workout logging:

1. **Cooperative gamification** — players belong to a "Clan" (squad), join a season-long race against other clans, and rescue members who fall behind.
2. **Adaptive autoregulation** — the app reads HRV / sleep / RPE and adjusts the next set's prescription in real time.

Other differentiators visible in the prototype:
- **Gym-aware exercise substitution** (the app knows which equipment is at the user's gym and suggests swaps).
- **AI Coach** — generates personalized workouts from intake answers; gives data-driven feedback on training history.
- **Routine sharing** — anyone with a link can copy a routine or workout to their own library.
- **Recovery-coloured body heatmap** — visualizes per-muscle volume distribution (personal + clan-wide).

---

## 2. Core Domain Model

The app distinguishes **three nested concepts**. The backend must model all three:

| Entity | What it is | Cardinality |
| --- | --- | --- |
| **Exercise** | A single movement (Barbell bench press) with a muscle group + equipment requirement. | ~150 globally + user-created |
| **Routine** | One day's session (e.g. "Push · Heavy", 5 exercises with sets × reps × rest × RPE). | Owned by a user; can be public/shareable |
| **Workout** | A weekly *program* = an ordered list of days, each day pointing to a Routine. (PPL, 5/3/1, Upper/Lower.) | Owned by a user; only one is "active" at a time |

**Glossary in the codebase:**
- `WORKOUTS` = weekly programs.
- `ROUTINES` = single-day sessions.
- `EXERCISES` = the library of movements + the in-progress logged set data for the active session.

### Workout structure
```jsonc
{
  "id": "w-m1",
  "name": "Hypertrophy 6× Upper/Lower",
  "author_id": "u-mara",
  "level": "Intermediate",        // Beginner | Intermediate | Advanced
  "tags": ["Upper Lower"],
  "description": "...",
  "duration": "6 weeks",
  "totalWeeks": 6,
  "week": 3,                      // current progress (per user)
  "current": true,                // active flag (per user; only one true)
  "daysPerWeek": 6,
  "days": [
    { "day": "Mon", "name": "Upper · Heavy", "routine_id": "r-m1" },
    { "day": "Wed", "name": "Rest",          "routine_id": null  },
    ...
  ]
}
```

### Routine structure
```jsonc
{
  "id": "r-m1",
  "name": "Push · Heavy",
  "author_id": "u-mara",
  "level": "Intermediate",
  "tags": ["Push"],
  "description": "...",
  "exercises": [
    { "name": "Barbell bench press", "sets": 5, "reps": "6", "rest": 150, "rpe": 7 },
    ...
  ]
}
```

### Logged Set (the unit of training history)
```jsonc
{
  "id": "ls-...",
  "user_id": "u-mara",
  "session_id": "s-...",
  "exercise_id": "ex-bench",
  "set_number": 3,
  "set_type": "normal",     // warmup | normal | drop | failure | superset | cluster
  "weight_kg": 80,
  "reps": 6,
  "rpe": 7,
  "completed_at": "2026-03-23T18:42:11Z",
  "prescribed": { "weight_kg": 80, "reps": 6, "rpe": 7 },
  "adjusted":  null         // populated by autoreg
}
```

---

## 3. Screens & Their Backend Dependencies

### 3.1 Auth
- Sign in / Register / forgot-password.
- Store: email, password (bcrypt/argon2), display name, handle, locale, units (kg/lb), `created_at`.
- Email or magic-link verification at signup.

### 3.2 Home (`Today`)
Dynamically computed per request:
- Greeting (`morning/afternoon/evening` based on user timezone).
- **Today's hero card** — derived from the user's **active workout** + today's day of week:
  - If no active workout → empty CTA.
  - If today is a rest day in the schedule → "Rest day".
  - If today isn't scheduled → "Off day".
  - Else → load the day's routine and show name, ex count, sets, duration.
- **Warm-up carousel** — 5 fixed mobility routines (could be CMS-driven).
- **Week strip** — last 7 days of session history with status (done / today / rest / planned).
- **Streak** — count of consecutive days with a logged session; `shields` = saved-skip tokens.
- **Clan strip** — if user has a clan, show clan name + active raid progress.
- **Feed preview** — last 2 posts from the user's clan feed.
- **Notifications** — unread count + list.

**Backend endpoints needed:**
- `GET /me/today` — composite payload above.
- `GET /me/notifications?unread=true`
- `POST /me/notifications/read`

### 3.3 Train
The hub for finding/building workouts and routines.

- **AI Coach** intake (6 questions) → generates a personalized workout. Today this is client-side; in production it should call:
  - `POST /coach/workout` body: `{ experience, goal, days, duration, equipment, focus }`
  - returns a generated workout with routines, persisted to the user's library on accept.
- **Trending** — paginated lists of public workouts + routines, filterable by `level` and `kind`.
- **Search** — full-text across name, tags, level, exercise names.
- **My Workouts** — list with `current` flag (toggleable, exclusive).
- **My Routines** — list of user-authored routines.
- **Build / Edit** — CRUD for both.
- **Sharing** — every workout and routine gets a public URL (`hivo.app/w/<slug>` or `/r/<slug>`); recipient view shows preview + "Copy to my library" CTA.

**Endpoints:**
- `GET  /workouts?scope=trending|mine&level=...&q=...`
- `GET  /workouts/:id`
- `POST /workouts` / `PATCH /workouts/:id` / `DELETE /workouts/:id`
- `POST /workouts/:id/set-active`
- (same for `/routines`)
- `GET  /share/w/:slug` / `GET /share/r/:slug` (unauth-accessible preview)
- `POST /share/copy { source_id, kind }` → creates a copy in caller's library
- `POST /coach/workout` → AI generation

### 3.4 Active Workout (logger)
The screen users live in. Two modes:
- **Live mode** — running timer, automatic rest timer between sets, autoreg adjustments.
- **Log-past mode** — fills in a past session, no timers.

Behaviors with backend hooks:
- **Adaptive autoreg**: when the logged RPE > prescribed + 1, the next set's weight is dropped 5%. The rule is currently hard-coded client-side; eventually it should be a server-side decision so it can incorporate sleep + HRV + 7-day fatigue.
  - `POST /sessions/:id/sets` → returns the next prescribed set (so the server stays in control).
- **Gym-aware substitution**: if an exercise's equipment isn't in the user's active gym, prompt swap.
  - `GET /gyms/:id/equipment` and per-routine substitute suggestions.
- **Technique sheet**: every exercise has cues + a video. Content is CMS-managed.
  - `GET /exercises/:id/technique`
- **Rest timer**: server doesn't care; runs client-side. Persist final session times only.

**Endpoints:**
- `POST /sessions` (start)
- `POST /sessions/:id/sets`
- `POST /sessions/:id/finish` → returns updated streak, contributions to clan raid, PR detections.

### 3.5 Squad (clan)
Two states:

#### a) No clan
- **Onboarding screen**: search by Clan ID (`IRC-4892`), browse trending clans, or **Create**.
- `GET  /clans/search?q=...` — by ID or name
- `GET  /clans/trending`
- `POST /clans` — create
- `POST /clans/:id/join-request` — requests must be accepted by a member
- `POST /clans/:id/requests/:reqId/accept` (clan members only)

#### b) In a clan
- **Clan tab**: shows the active raid (collective goal), weekly missions, leaderboard, **clan body heatmap** (combined muscle-strength averaged across members), and rescue-mode banner when teammates fall behind.
- **Feed tab**: post composer (text + video attachment), feed of posts with likes + comments + reactions. Plus a "Discover clans" search remains visible here (for users who want to migrate, since they can `Leave`).
- **⋯ menu**: Invite friends, Members, Settings, Clan ID, **Leave clan**.

**Backend needs:**
- Clan model: id, slug (`IRC-4892`), name, photo, member_ids (max 8), rank, season, founder_id.
- Raid model: per clan + season; target weight, current cumulative weight, end_date, scoring rule, rescue_mode flag, multiplier window.
- Mission model: weekly objectives; some are individual-rolled-up ("each member ≥ 1 leg session"); some collective.
- Leaderboard: per-season point totals per clan, computed nightly.
- Feed posts: type (`text` | `video` | `pr` | `system`), media URLs (we'd use S3-compatible storage with CDN), reactions, comments.
- Permissions: only members can post; clan ID join requires acceptance by any member.

### 3.6 Progress (Stats)
Read-only analytics:
- Bodyweight series.
- Volume heatmap (per muscle × per week, last 12 weeks).
- Recent PRs.
- Weekly summary (sessions, volume, PRs, avg RPE).
- Personal **body strength heatmap** (intensity per muscle group, computed from e1RM + relative volume).
- **AI Coach feedback sheet** — generates 4 insight cards + 4 conversational follow-ups. Should call:
  - `POST /coach/feedback` returns insights + suggested follow-ups, given the user's full training history window.

### 3.7 You (Profile)
- Identity card (avatar, name, handle, gym).
- Mini stats (workouts, streak, PRs).
- Body weight + trend.
- **Settings**: Account, My Data (CSV export), Privacy & Accessibility.
- **Reset all history** — destructive, requires typing `RESET`.

**Endpoints:**
- `GET  /me`
- `PATCH /me` (name, email, password)
- `POST /me/export?scope=all|year|30d&include=workouts,body,prs` → returns CSV stream or async job + email link.
- `POST /me/history/reset` — soft-deletes all sessions/PRs but keeps account, routines, clan membership.

---

## 4. AI Coach

Two distinct flows. Both should be backed by an LLM with structured output schemas.

### 4.1 Workout generator (Train tab)
**Input** — 6-question intake:
- `experience`: new | casual | regular | veteran
- `goal`: strength | hypertrophy | recomp | general
- `days`: 3 | 4 | 5 | 6
- `duration`: 30 | 45 | 60 | 90 (minutes)
- `equipment`: full | home | dbs | bw
- `focus`: none | upper | lower | posterior

**Output** — a full Workout object with embedded Routines (one per day).

The client currently builds this deterministically (`buildWorkout` in `train.jsx`). In prod, replace with a server-side LLM call constrained by a JSON schema, with the deterministic builder as a fallback.

### 4.2 Feedback engine (Stats tab)
**Input** — the user's recent training data: last 12 weeks of sets, PRs, body weight, recovery markers.

**Output** — a list of insight cards:
```jsonc
{
  "summary": "...",
  "insights": [
    { "kind": "good|warn|info", "title": "...", "body": "...", "metric": "+8.4%" }
  ],
  "followups": [
    { "id": "plateau", "label": "...", "answer": "..." }
  ]
}
```

The user can also ask free-form follow-ups (future enhancement).

---

## 5. Notifications

Pushed events (also stored in DB and surfaced in the bell sheet):
- `raid_rescue` — a clanmate is behind; reps count 2× until end-of-week.
- `pr` — a clanmate (or you) hit a PR.
- `autoreg` — Hivo softened/raised tomorrow's target based on recovery markers.
- `clan` — like, comment, join request accepted.
- `mission` — weekly mission completed.
- `system` — release notes, etc.

**Backend:**
- APNs for iOS push.
- Notifications inbox: `GET /me/notifications` returns paginated list, `?unread=true` filter.
- `POST /me/notifications/:id/read` and `POST /me/notifications/read-all`.

---

## 6. Sharing

Public, unauth-readable preview pages for:
- Routine: `hivo.app/r/<slug>`
- Workout: `hivo.app/w/<slug>`
- Clan invite: `hivo.app/c/<slug>` (joins a clan after auth)

These should be cacheable, SEO-friendly (server-rendered), and have OG tags so previews look good when shared in Messages / WhatsApp.

**Endpoint shape:** `GET /share/{kind}/{slug}` returns the entity (denormalized, including author handle + photo) for anonymous read.

---

## 7. Data Export

`POST /me/export` produces a CSV with three sections concatenated:
1. **Workout logs** — per-set rows: `date, workout_name, exercise, set_number, set_type, weight_kg, reps, rpe`.
2. **Body measurements** — `date, body_weight_kg, body_fat_pct`.
3. **Personal records** — `exercise, pr_weight_kg, pr_reps, date`.

The user picks scope (`30d | year | all`) and which sections to include.

For large exports (> a few thousand rows), make this an async job and email a download link.

---

## 8. Tweaks (theming)

The prototype exposes runtime tweaks for: accent color (purple default, plus blood-red / lime / orange / blue), background tone (true black / charcoal / midnight), font pair (Geist / Manrope / mono), density (comfy / compact), logger layout (list / hybrid / focus), and a gamification kill-switch.

In production, persist these as **user preferences**:
```
PATCH /me/preferences
{
  "accent": "#b26bff",
  "bg_tone": "true_black",
  "font_pair": "geist",
  "density": "comfy",
  "logger_layout": "hybrid",
  "gamification_enabled": true
}
```

The gamification switch should genuinely hide the Squad tab + streak + ranks server-side too, so APIs don't push raid notifications to users with gamification off.

---

## 9. Suggested Tech Stack

These are recommendations; adapt to team preferences.

| Concern | Suggested |
| --- | --- |
| **API** | FastAPI (Python) or Hono/Nest (TS) with OpenAPI schemas; REST + a few WebSockets for live raid progress. |
| **DB** | Postgres with row-level security. Use `citext` for handles. |
| **Search** | Postgres FTS (`tsvector`) is enough at first; bring in Meilisearch if needed. |
| **Auth** | Email/password + Apple Sign In + Google. JWT short-lived + refresh; or Supabase / Clerk. |
| **Media** | S3 (or R2) with signed-URL uploads for feed videos + profile photos. Transcode with `mediaconvert` or `mux` to multiple bitrates. |
| **Push** | APNs directly, or a service like OneSignal. |
| **Background jobs** | Sidekiq / Celery / RQ for: export CSV, season leaderboard, PR detection, streak updates, deload prompts. |
| **LLM** | Anthropic Claude or OpenAI gpt-* for the AI Coach flows, with strict JSON-schema response forcing. Cache common intake combinations. |
| **Analytics** | Posthog or Mixpanel for product funnels. Sentry for errors. |

---

## 10. Open Questions for Product / Eng

1. **Adaptive autoreg rule** — is the 5%-drop heuristic enough, or do we want a real per-user model based on rolling fatigue?
2. **Clan size cap** — currently 8. Fixed for season balance, or configurable for friend groups?
3. **Season cadence** — weekly leaderboards vs. monthly seasons. The prototype says "Week 3 of season"; we should commit to a length.
4. **PR detection rules** — by absolute weight, e1RM, weight × reps? The prototype hand-waves it.
5. **Video moderation** — clan posts can attach videos. Need a moderation layer (or just keep it disabled at launch).
6. **Equipment catalog** — who owns the gym→equipment mapping? Crowdsourced like Gymrats does it, or curated?

---

## 11. Glossary

- **e1RM** — estimated 1-rep max, derived from a set's weight × reps via Epley or similar.
- **RPE** — Rate of Perceived Exertion, 1–10.
- **Autoreg** — autoregulation; adjusting prescription based on readiness markers.
- **Deload** — a planned light week to dissipate fatigue.
- **Raid** — a time-bound collective goal for a clan to hit (e.g. lift 50,000 kg in 7 days).
- **Shield** — a streak-protection token; auto-uses if the user misses a planned day.
- **Mission** — a weekly objective (sometimes per-member, sometimes collective).

---

*Generated from the Hivo prototype HTML. Anything ambiguous? Ask. Don't guess at a rule the prototype encodes — pull the constants directly out of `ui.jsx` or the component file the screen lives in.*
