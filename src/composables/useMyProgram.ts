import type { Session } from '~/types/conference'

// Versionsnummer im Schlüssel: Ändert sich das Speicherformat, stören alte Einträge nicht
const STORAGE_KEY = 'frontendnow:my-program:v1'

// Zwei Sessions überschneiden sich, wenn sie am selben Tag gleichzeitig laufen
const overlaps = (a: Session, b: Session) =>
  a.day === b.day && a.startTime < b.endTime && b.startTime < a.endTime

/**
 * Persönliches Programm („Mein Programm“), siehe State-Management-Konzept.
 * Gespeichert werden nur Session-IDs. Die vollen Sessions werden über
 * useConferenceData() abgeleitet. Nur dieses Composable greift auf localStorage zu.
 */
export function useMyProgram() {
  const ids = useState<string[]>('my-program', () => [])
  const isHydrated = useState('my-program-hydrated', () => false)
  const { getSessionsByIds, hasSession } = useConferenceData()

  // Volle Sessions, nach Tag und Uhrzeit sortiert
  const sessions = computed(() => getSessionsByIds(ids.value))

  // Pro Session-ID die gemerkten Sessions, die zur selben Zeit laufen
  const conflicts = computed(() => {
    const result = new Map<string, Session[]>()
    for (const session of sessions.value) {
      const overlapping = sessions.value.filter(other => other.id !== session.id && overlaps(session, other))
      if (overlapping.length > 0) result.set(session.id, overlapping)
    }
    return result
  })

  const isInProgram = (id: string) => ids.value.includes(id)

  function add(id: string) {
    if (hasSession(id) && !isInProgram(id)) ids.value = [...ids.value, id]
  }

  function remove(id: string) {
    ids.value = ids.value.filter(savedId => savedId !== id)
  }

  function toggle(id: string) {
    if (isInProgram(id)) remove(id)
    else add(id)
  }

  // Liest gespeicherte IDs; verwirft alles, was keine bekannte Session-ID ist
  function readStorage(): string[] {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
      if (!Array.isArray(parsed)) return []
      return [...new Set(parsed)].filter((id): id is string => typeof id === 'string' && hasSession(id))
    }
    catch {
      return [] // z. B. kaputter Eintrag oder gesperrter Speicher im privaten Modus
    }
  }

  function writeStorage(value: string[]) {
    try {
      const serialized = JSON.stringify(value)
      if (localStorage.getItem(STORAGE_KEY) !== serialized) localStorage.setItem(STORAGE_KEY, serialized)
    }
    catch {
      // Speichern nicht möglich (z. B. privater Modus): Programm gilt nur für diesen Besuch
    }
  }

  /**
   * Rehydration: einmalig im Browser localStorage auslesen, danach jede Änderung
   * speichern und Änderungen aus anderen Tabs übernehmen.
   * Wird vom Client-Plugin plugins/my-program.client.ts aufgerufen.
   */
  function hydrate() {
    if (import.meta.server || isHydrated.value) return
    ids.value = readStorage()
    isHydrated.value = true

    watch(ids, writeStorage)
    window.addEventListener('storage', (event) => {
      if (event.key === STORAGE_KEY) ids.value = readStorage()
    })
  }

  return {
    ids: readonly(ids),
    sessions,
    conflicts,
    isHydrated: readonly(isHydrated),
    isInProgram,
    add,
    remove,
    toggle,
    hydrate,
  }
}
