export type MemoryLaneFilm = {
  title: string
  year: number
  language: string
  /** Pull quote shown under the TV. "[ … ]" until the client supplies it. */
  quote: string
  /** Montage clip. `null` shows the sepia stand-in (or `image` when present). */
  video: string | null
  /** Still / video poster. `null` shows the sepia stand-in. */
  image: string | null
}

export type MemoryLaneEra = {
  label: string
  /** Films released before this year belong to the era. Leave it off the last era. */
  beforeYear?: number
}

export type MemoryLanePolaroid = {
  caption: string
  image: string | null
}

export type MemoryLaneData = {
  heading: string
  headingTa?: string
  tagline: string
  /** Brand plate on the cabinet. */
  badge: string
  /** Title of the film the TV starts on. Falls back to the first film. */
  startFilm: string
  eras: MemoryLaneEra[]
  films: MemoryLaneFilm[]
  polaroids: MemoryLanePolaroid[]
}
