import Link from 'next/link'
import { useState } from 'react'
import s from 'styled-components'

import { BORDER, MEDIUM_GRAY, WHITE } from '../../constants/colors'
import { CLUB_EDIT_ROUTE } from '../../constants/routes'
import { ROLE_OFFICER } from '../../utils'
import { BookmarkIcon, SubscribeIcon } from '../common'

const Wrapper = s.span`
  display: flex;
  flex-direction: row;
  align-items: right;
  justify-content: flex-end;
  margin-bottom: 0.8rem;
  line-height: 1;
`

const BookmarkCountWrapper = s.div`
  margin-left: 2px;
  color: ${MEDIUM_GRAY};
`

const ActionWrapper = s.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  padding-top: 5px;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  margin-bottom: 0.8rem;

  background-color: ${WHITE};
  border-radius: 14px;
  border: 1px solid ${BORDER};
  line-height: 1;
  height: 30px;
`

const ActionDiv = s.div`
  display: inline-block;
  opacity: 0.1;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  line-height: 1;
  margin-top: -1px;
`

const EditButton = s.button`
  font-size: 0.8em;
  margin-right: 20px;
`

const Actions = ({
  club,
  userInfo,
  style,
  updateFavorites,
  updateSubscriptions,
  className,
}) => {
  const { code, favorite_count: favoriteCount } = club
  const isFavorite = club.is_favorite
  const isSubscription = club.is_subscribe

  // inClub is set to the membership object if the user is in the club, otherwise false
  const inClub = club.is_member !== false ? { role: club.is_member } : false

  // a user can edit a club if they are either a superuser or in the club and
  // at least an officer
  const canEdit =
    (inClub && inClub.role <= ROLE_OFFICER) ||
    (userInfo && userInfo.is_superuser)

  const [favCount, setFavCount] = useState(favoriteCount || 0)

  return (
    <div className={className} style={style}>
      <Wrapper>
        {canEdit && (
          <Link href={CLUB_EDIT_ROUTE()} as={CLUB_EDIT_ROUTE(code)}>
            <EditButton className="button is-success">Edit Club</EditButton>
          </Link>
        )}

        <ActionWrapper>
          <BookmarkIcon
            club={club}
            favorite={isFavorite}
            updateFavorites={(id) => {
              const upd = updateFavorites(id)
              // If upd is null, checkAuth in renderPage failed, so we do not update the count.
              if (upd !== null) setFavCount(favCount + (upd ? 1 : -1))
            }}
            padding="0"
          />
          <BookmarkCountWrapper>{favCount}</BookmarkCountWrapper>
          <ActionDiv>|</ActionDiv>
          <SubscribeIcon
            padding="0"
            club={club}
            subscribe={isSubscription}
            updateSubscribes={updateSubscriptions}
          />
        </ActionWrapper>
      </Wrapper>
    </div>
  )
}

export const DesktopActions = s(Actions)`
  @media (max-width: 768px) {
    display: none !important;
  }
`

export const MobileActions = s(Actions)`
  @media (min-width: 769px) {
    display: none !important;
  }
`
