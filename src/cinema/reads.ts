import fanNotes from '@content/fan-notes.json'
import interviews from '@content/interviews.json'
import type { Read } from './scenes/Words'

/** "In her words": the latest note, then one each of the first video, interview and article. */
export function reads(): Read[] {
  const note = fanNotes.notes[0]
  const pick = (type: string) => interviews.items.find((i) => i.type === type)
  const pieces = [pick('Video'), pick('Interview'), pick('Article')].filter((i) => i !== undefined)
  return [
    { type: 'Note to fans', short: note.greet, title: note.greet, body: `${note.body}\n\n— ${fanNotes.signature.name}`, source: note.date, image: note.image },
    ...pieces.map((i) => ({
      type: i.type === 'Video' ? 'Video interview' : i.type,
      short: i.title,
      title: i.title,
      body: i.quote ?? ('dek' in i ? (i.dek ?? '') : ''),
      source: i.source,
      url: i.url,
      image: i.poster,
    })),
  ]
}
