import rawData from '~~/data/conference-data.json'
import { LEVELS } from '~/types/conference'
import type { ConferenceData, Session, Speaker } from '~/types/conference'

// Den Datensatz einmalig tief einfrieren: Er ist schreibgeschützt und wird auf dem
// Server von allen Anfragen geteilt, darf also nirgends verändert werden.
function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value)
    Object.values(value).forEach(deepFreeze)
  }
  return value
}

// Datenquelle (einzige Stelle, an der Daten hereinkommen).
// Heute: statischer Import, die Daten werden beim Build mitgeliefert (kein Fetch zur Laufzeit).
// Ausbaupfad ISR (siehe Rendering-ADR): Ein Plugin lädt die Daten von einer URL und setzt
// `source.value`, bevor gerendert wird. Alle Getter unten lesen aus `source` und bleiben
// gleich, die Komponenten müssen deshalb nicht angepasst werden.
const source = shallowRef<ConferenceData>(deepFreeze(rawData as ConferenceData))

const byStartTime = (a: Session, b: Session) =>
  a.day.localeCompare(b.day) || a.startTime.localeCompare(b.startTime)

// Lookups und abgeleitete Listen einmalig aufbauen, damit Komponenten nicht selbst suchen
const index = computed(() => {
  const data = source.value
  return {
    sessions: [...data.sessions].sort(byStartTime),
    sessionsById: new Map(data.sessions.map(s => [s.id, s])),
    speakersById: new Map(data.speakers.map(s => [s.id, s])),
    tracksById: new Map(data.tracks.map(t => [t.id, t])),
    roomsById: new Map(data.rooms.map(r => [r.id, r])),
    timeSlots: [...new Set(data.sessions.map(s => s.startTime))].sort(),
  }
})

const dayFormats = {
  weekday: { weekday: 'long', day: 'numeric', month: 'long' },
  date: { day: 'numeric', month: 'long', year: 'numeric' },
} satisfies Record<string, Intl.DateTimeFormatOptions>

export function useConferenceData() {
  const getSession = (id: string) => index.value.sessionsById.get(id)
  const getSpeaker = (id: string) => index.value.speakersById.get(id)

  return {
    conference: computed(() => source.value.conference),
    tracks: computed(() => source.value.tracks),
    rooms: computed(() => source.value.rooms),
    speakers: computed(() => source.value.speakers),
    sessions: computed(() => index.value.sessions),
    timeSlots: computed(() => index.value.timeSlots),

    // Auswahllisten für die Filter (Raum, Tag, Track, Level, Uhrzeit, Speaker)
    filterOptions: computed(() => ({
      days: source.value.conference.dates,
      rooms: source.value.rooms,
      tracks: source.value.tracks,
      levels: LEVELS.filter(level => index.value.sessions.some(s => s.level === level)),
      timeSlots: index.value.timeSlots,
      speakers: [...source.value.speakers].sort((a, b) => a.name.localeCompare(b.name, 'de')),
    })),

    getSession,
    getSpeaker,
    getTrack: (id: string) => index.value.tracksById.get(id),
    getRoom: (id: string) => index.value.roomsById.get(id),
    hasSession: (id: string) => index.value.sessionsById.has(id),

    getSessionSpeakers: (session: Session): Speaker[] =>
      session.speakerIds.map(getSpeaker).filter(speaker => speaker !== undefined),
    getSessionsBySpeaker: (speakerId: string) =>
      index.value.sessions.filter(s => s.speakerIds.includes(speakerId)),
    getSessionsByDay: (day: string) =>
      index.value.sessions.filter(s => s.day === day),
    // Für „Mein Programm“: IDs auflösen, unbekannte IDs verwerfen, nach Tag/Uhrzeit sortieren
    getSessionsByIds: (ids: readonly string[]) =>
      ids.map(getSession).filter(session => session !== undefined).sort(byStartTime),

    // Konferenztag ("2026-09-15") immer in der Zeitzone der Konferenz formatieren,
    // damit Server (Build) und Browser denselben Tag anzeigen
    formatDay: (day: string, style: keyof typeof dayFormats = 'weekday') =>
      new Intl.DateTimeFormat('de-AT', {
        ...dayFormats[style],
        timeZone: source.value.conference.timezone,
      }).format(new Date(`${day}T00:00:00Z`)),
  }
}
