import type { LocationQueryRaw } from 'vue-router'
import type { Session } from '~/types/conference'

export const FILTER_KEYS = ['day', 'time', 'room', 'track', 'level', 'speaker'] as const
export type FilterKey = typeof FILTER_KEYS[number]
export type SessionFilters = Record<FilterKey, string | undefined>

// Prüft pro Kriterium, ob eine Session zum gewählten Wert passt
const matchers: Record<FilterKey, (session: Session, value: string) => boolean> = {
  day: (session, value) => session.day === value,
  time: (session, value) => session.startTime === value,
  room: (session, value) => session.roomId === value,
  track: (session, value) => session.trackId === value,
  level: (session, value) => session.level === value,
  speaker: (session, value) => session.speakerIds.includes(value),
}

/**
 * Filtert eine Liste von Sessions nach Tag, Uhrzeit, Raum, Track, Level und Speaker.
 * Alle gesetzten Filter werden UND-verknüpft. Der Filterzustand steht in der URL-Query,
 * damit gefilterte Ansichten teilbar sind und „Mein Programm“ unberührt bleibt.
 *
 * @param sessions alle Sessions (Programmübersicht) oder die gemerkten („Mein Programm“)
 */
export function useSessionFilter(sessions: MaybeRefOrGetter<readonly Session[]>) {
  const route = useRoute()
  const router = useRouter()
  const nuxtApp = useNuxtApp()
  const { filterOptions } = useConferenceData()

  // Das vorgerenderte HTML (SSG) kennt keine Query. Damit Server-HTML und Browser
  // übereinstimmen, greifen die Filter erst nach der Hydration (siehe Rendering-ADR).
  const isActive = ref(import.meta.client && !nuxtApp.isHydrating)
  onMounted(() => {
    isActive.value = true
  })

  // Nur Werte zulassen, die im Datensatz vorkommen (z. B. kein ?track=gibt-es-nicht)
  const allowedValues = computed<Record<FilterKey, Set<string>>>(() => {
    const options = filterOptions.value
    return {
      day: new Set(options.days),
      time: new Set(options.timeSlots),
      room: new Set(options.rooms.map(room => room.id)),
      track: new Set(options.tracks.map(track => track.id)),
      level: new Set(options.levels),
      speaker: new Set(options.speakers.map(speaker => speaker.id)),
    }
  })

  const filters = computed<SessionFilters>(() => {
    const result = {} as SessionFilters
    for (const key of FILTER_KEYS) {
      const value = route.query[key]
      result[key] = isActive.value && typeof value === 'string' && allowedValues.value[key].has(value)
        ? value
        : undefined
    }
    return result
  })

  const filteredSessions = computed(() =>
    toValue(sessions).filter(session =>
      FILTER_KEYS.every((key) => {
        const value = filters.value[key]
        return value === undefined || matchers[key](session, value)
      }),
    ),
  )

  const activeCount = computed(() => FILTER_KEYS.filter(key => filters.value[key]).length)

  // router.replace() ist asynchron: Werden mehrere Filter schnell nacheinander gesetzt,
  // baut jede Änderung auf der noch nicht angewendeten vorherigen auf, statt sie zu überschreiben.
  let pendingQuery: LocationQueryRaw | undefined

  function updateQuery(change: (query: LocationQueryRaw) => LocationQueryRaw) {
    const query = change(pendingQuery ?? route.query)
    pendingQuery = query
    router.replace({ query }).finally(() => {
      if (pendingQuery === query) pendingQuery = undefined
    })
  }

  function setFilter(key: FilterKey, value: string | undefined) {
    updateQuery(query => ({ ...query, [key]: value || undefined }))
  }

  function resetFilters() {
    updateQuery(query => Object.fromEntries(
      Object.entries(query).filter(([key]) => !FILTER_KEYS.includes(key as FilterKey)),
    ))
  }

  return { filters, filteredSessions, activeCount, setFilter, resetFilters }
}
