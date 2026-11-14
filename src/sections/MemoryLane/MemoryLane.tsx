import { Container, SectionHeading } from '@/components/ui'
import { MemoryLaneStage } from './MemoryLaneStage'
import type { MemoryLaneData } from './types'
import s from './MemoryLane.module.css'

export type { MemoryLaneData, MemoryLaneFilm, MemoryLaneEra, MemoryLanePolaroid } from './types'

/** Homepage §8: a vintage walnut TV on a memory wall (HANDOVER.md §3 item 8). */
export function MemoryLane({ data }: { data: MemoryLaneData }) {
  return (
    <section id="memory-lane" aria-labelledby="ml-h" className={s.section}>
      <Container>
        <MemoryLaneStage
          data={data}
          heading={
            <div>
              <div aria-hidden="true" className={s.ornament}>
                <span className={s.ornamentStar}>✦</span>
                <span className={s.ornamentRule} />
              </div>
              <SectionHeading id="ml-h" className={s.title}>
                {data.heading}
              </SectionHeading>
              <div className={s.sub}>
                <span lang="ta" className={s.subTa}>
                  {data.headingTa}
                </span>
                <span className={s.tagline}>{data.tagline}</span>
              </div>
            </div>
          }
        />
      </Container>
    </section>
  )
}
