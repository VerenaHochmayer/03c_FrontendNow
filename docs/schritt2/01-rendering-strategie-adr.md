# Rendering Strategy (ADR)

For choosing a rendering strategy per route we defined following criteria:

1. **Change frequency:** How often does the content change, and how?
2. **Personalisation:** Same content for everyone, or per visitor?
3. **Data location:** Available at build time, or only in the visitor's browser?
4. **Offline use:** Must the page work without a connection (unreliable conference Wi-Fi)?
5. **First load:** Is complete HTML needed immediately for speed and search engines?

Our data is a static, read-only `conference-data.json`, bundled at build time. There is no backend.

## 1. Speaker Profiles (`/speakers`, `/speakers/[id]`)

### Context

There are 18 speakers with name, title, company, bio and session IDs. The content is
identical for every visitor and only changes when the JSON file is edited and the
site is rebuilt. Realistically, that should happen before the conference, not during it.
Profiles should load fast, be findable by search engines and work offline. Each
profile also lists the speaker's talks, each with a "save to My Programme" toggle,
and that toggle's state is personal.

### Options

- **SSG:** Pre-render all 18 profiles to static HTML at build time.
- **SSR:** Render each profile on the server per request. It would always be up to date, but our data only changes on a rebuild anyway, so every request repeats identical work and needs a running server.
- **CSR:** Ship an empty page and render it in the browser. No server is needed, but the HTML is empty for search engines and the first paint is slower.

### Decision

We use **SSG**. Only the personal part is excluded:
the save toggle reads `useMyProgram()` in the browser and is wrapped in `<ClientOnly>`,
so the static HTML never contains a guessed state.

### Consequences

With SSG we achieve the fastest delivery, it's servable from any static host and easy to cache for offline use. 
It also doesn't need a server to run or maintain.
On the downside, any change to a profile requires a rebuild and a redeploy. Also the toggle state only appears once JavaScript has loaded.

## 2. Session Detail Pages (`/sessions/[id]`)

### Context

There are 20 sessions with title, abstract, speakers, track, level, format, day,
time and room, identical for everyone. Unlike bios, **time and room** are the fields
most likely to change during a conference (room swap, cancellation), and a wrong
time misleads visitors. However, right now our data still lives in the repository: every change is a
commit followed by a new build.

### Options

- **SSG:** Pre-render all 20 pages. A change requires a rebuild.
- **ISR:** Pre-render and regenerate in the background after an interval, e.g. 60 seconds. This only helps if data is fetched at runtime. With bundled JSON, regeneration produces identical HTML, and it requires an ISR-capable host.
- **SSR:** Always current, but needs a server per request and does not work offline.

### Decision

We use **SSG** for a concrete reason: in our pipeline, "the
schedule changes" always means "we redeploy", so SSG is as current as ISR at lower
complexity. ISR remains the upgrade path: if the schedule were loaded from an external
URL, we would switch from our SSG Session pages to ISR. Since all data access goes through
`useConferenceData()`, no component would change.

### Consequences

The SSG strategy is fast, offline-friendly and works on static hosting. However, schedule changes during the event would require a rebuild and deploy.
Cached pages may show an outdated time until visitors are online again, so the offline strategy must refresh HTML when possible.

## 3. Session Overview with Filters (`/sessions`)

### Context

The overview is a timetable of all 20 sessions, filterable by room, day, track, level,
time and speaker, with the filter state in the URL query (see architecture ADR). The
dataset is tiny and known at build time. Visitors open this page most often at the
venue, so offline use matters most here, and a schedule change would reach the most
people here.

### Options

- **SSR:** Render and filter on the server per request (e.g. `/sessions?room=room-a`). Filtered HTML arrives immediately, but every filter change needs a server round trip, which fails offline.
- **ISR:** Pre-render the unfiltered timetable, regenerate it periodically, filter in the browser. Requires an ISR-capable host.
- **SSG + client-side filtering:** Pre-render the timetable once. `useSessionFilter()` filters the 20 entries in the browser instantly, even offline.

### Decision

We implement **SSG with client-side filtering** and with that deviate from the scenario's
SSR/ISR suggestion. SSR's main advantage, fresh data per request, does not exist for
us because the data is bundled. Filtering 20 entries in the browser costs nothing, and
offline availability is our core promise.

If the schedule could change at runtime, we would choose ISR rather than SSR: the
content is identical for everyone, so one cached version per minute suffices, while
SSR would re-render the same page for every request.

### Consequences

With this strategy combination we provide instant filtering, which works offline and on static hosting.
One disadvantage is that a shared filtered link first shows the full timetable, and the filter applies after hydration.
Also the schedule changes need a rebuild, as with the detail pages.

## 4. "My Programme" Dashboard (`/mein-programm`)

### Context

This page shows the sessions a visitor has saved, stored as IDs in `localStorage`
(see state management concept). The content differs per visitor, is unknown at build
time and unavailable on the server, which cannot read `localStorage`. The page is
private, so search engines are irrelevant, but it must work offline during the event.

### Options

- **CSR:** Render the route only in the browser. The app reads `localStorage` and then renders.
- **SSR:** The server does not know the saved IDs and would render an empty programme, which the browser then replaces, causing a hydration mismatch and flicker. Fixing this would require sending the programme via cookies, contradicting "no backend, no server state".
- **SSG:** Pre-render the page shell and fill it in the browser. The first paint is faster, but the pre-rendered empty state ("nothing saved yet") would briefly mislead visitors who have saved sessions.

### Decision

We use **CSR**, matching the scenario. With
`nuxt generate`, Nuxt still outputs an HTML shell for the route, so it works on static
hosting.

### Consequences

We have no hydration mismatches, and `localStorage` is accessed safely in one place (`useMyProgram()`). Also we have no server dependency at all, which is ideal for offline use.
We do require JavaScript though, and nothing renders without it. And with this strategy, we have a short loading state before content appears. But for that We show a neutral loading hint instead of the empty state.

## Summary

| Route | Strategy | Main reason |
|---|---|---|
| `/speakers`, `/speakers/[id]` | SSG | Static, public, changes only with a rebuild |
| `/sessions/[id]` | SSG (ISR as upgrade path) | Data is bundled, so a change always means a rebuild |
| `/sessions` | SSG + client-side filtering (ISR conceptually) | Tiny dataset, offline is essential |
| `/mein-programm` | CSR | Personal data exists only in `localStorage` |
