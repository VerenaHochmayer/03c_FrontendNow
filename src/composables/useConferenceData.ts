import rawData from '~~/data/conference-data.json'
import type { ConferenceData, Session } from '~/types/conference'

// Statischer Import: Die Daten werden beim Build mitgeliefert (kein Fetch zur Laufzeit).
const data = rawData as ConferenceData

// Lookups einmalig aufbauen, damit Komponenten nicht selbst in Arrays suchen
const sessionsById = new Map(data.sessions.map(s => [s.id, s]))
const speakersById = new Map(data.speakers.map(s => [s.id, s]))
const tracksById = new Map(data.tracks.map(t => [t.id, t]))
const roomsById = new Map(data.rooms.map(r => [r.id, r]))

const byStartTime = (a: Session, b: Session) =>
  a.day.localeCompare(b.day) || a.startTime.localeCompare(b.startTime)

export function useConferenceData() {
  return {
    conference: readonly(data.conference),
    tracks: readonly(data.tracks),
    rooms: readonly(data.rooms),
    speakers: readonly(data.speakers),
    sessions: readonly([...data.sessions].sort(byStartTime)),

    getSession: (id: string) => sessionsById.get(id),
    getSpeaker: (id: string) => speakersById.get(id),
    getTrack: (id: string) => tracksById.get(id),
    getRoom: (id: string) => roomsById.get(id),

    getSessionsBySpeaker: (speakerId: string) =>
      data.sessions.filter(s => s.speakerIds.includes(speakerId)).sort(byStartTime),
    getSessionsByDay: (day: string) =>
      data.sessions.filter(s => s.day === day).sort(byStartTime),
  }
}
