import { ReactElement, useEffect } from 'react'
import s from 'styled-components'

import ClubCard from '../components/ClubCard'
import ClubTableRow from '../components/ClubTableRow'
import { mediaMaxWidth, SM } from '../constants/measurements'
import { Club, Tag } from '../types'

const ClubTableRowWrapper = s.div`
  ${mediaMaxWidth(SM)} {
    margin-left: -1rem;
    margin-right: 1rem;
    width: calc(100vw);
  }
`

type ClubDisplayProps = {
  displayClubs: Club[]
  tags: Tag[]
  display: 'cards' | 'list'
  onScroll?: () => void
  pageSize?: number
}

const ClubDisplay = ({
  displayClubs,
  display,
  onScroll = () => undefined,
}: ClubDisplayProps): ReactElement => {
  const onWindowScroll = (): void => {
    const { innerHeight = 0, scrollY = 0 } = window
    const {
      body: { offsetHeight = 0 },
    } = document

    if (innerHeight + scrollY >= offsetHeight - innerHeight / 2) {
      onScroll()
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', onWindowScroll, false)
    onWindowScroll()
    return () => window.removeEventListener('scroll', onWindowScroll, false)
  }, [])

  if (display === 'cards') {
    return (
      <div className="columns is-multiline is-desktop is-tablet">
        {displayClubs.map((club) => (
          <ClubCard key={club.code} club={club} />
        ))}
      </div>
    )
  }

  return (
    <ClubTableRowWrapper>
      {displayClubs.map((club) => (
        <ClubTableRow club={club} key={club.code} />
      ))}
    </ClubTableRowWrapper>
  )
}

export default ClubDisplay
