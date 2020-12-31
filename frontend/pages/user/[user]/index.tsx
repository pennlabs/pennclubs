import { NextPageContext } from 'next'
import Link from 'next/link'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import ClubCard from '../../../components/ClubCard'
import {
  Contact,
  Container,
  Icon,
  Metadata,
  ProfilePic,
  Subtitle,
  Title,
} from '../../../components/common'
import AuthPrompt from '../../../components/common/AuthPrompt'
import {
  BULMA_INFO,
  CLUBS_BLUE,
  CLUBS_GREY,
  CLUBS_PURPLE,
  SETTINGS_ROUTE,
  WHITE,
} from '../../../constants'
import renderPage from '../../../renderPage'
import { MembershipRank, UserInfo, UserProfile } from '../../../types'
import { doApiRequest } from '../../../utils'
import { OBJECT_NAME_TITLE } from '../../../utils/branding'

type UserProfilePageProps = {
  profile: UserProfile | { detail: string }
  authenticated: boolean | null
  userInfo?: UserInfo
}

const GraduationYearTag = ({ year }: { year: number | null }): ReactElement => {
  let now = new Date().getFullYear()
  if (new Date().getMonth() > 7) {
    now += 1
  }
  if (year == null || typeof year !== 'number') {
    return <span className="tag is-light ml-1">Unknown</span>
  }
  if (year < now) {
    return <span className="tag is-light ml-1">Alumni</span>
  }
  const mapping = {
    0: 'Senior',
    1: 'Junior',
    2: 'Second Year',
    3: 'First Year',
  }
  const diff = year - now
  if (diff in mapping) {
    return <span className="tag is-primary ml-1">{mapping[diff]}</span>
  }
  return <span className="tag is-light ml-1">Unknown</span>
}

const ClubCardAddon = styled.div<{ rank: number; active: boolean }>`
  float: right;
  color: ${WHITE};
  background-color: ${({ rank, active }) =>
    active
      ? {
          [MembershipRank.Member]: BULMA_INFO,
          [MembershipRank.Officer]: CLUBS_BLUE,
          [MembershipRank.Owner]: CLUBS_PURPLE,
        }[rank]
      : CLUBS_GREY};
  padding: 5px 12px;
  border-radius: 0 0 5px 5px;
  margin-right: 12px;
`

const UserProfilePage = ({
  profile,
  authenticated,
  userInfo,
}: UserProfilePageProps): ReactElement => {
  if ('detail' in profile) {
    return (
      <AuthPrompt title="Oh no!" hasLogin={!authenticated}>
        You cannot view the profile for this user. This user might not exist or
        have set their profile to private.{' '}
        <span className="has-text-grey">{profile.detail}</span>
      </AuthPrompt>
    )
  }

  return (
    <Container paddingTop>
      <Metadata title={profile.name} />
      {userInfo?.username === profile.username && (
        <div className="notification is-info is-light">
          <Icon name="alert-circle" /> This is your profile page. You will
          always be able to see all of the information shown here. Currently,
          other people <b>{userInfo?.show_profile ? 'can' : 'cannot'}</b> see
          this page. To change this, go to the{' '}
          <Link href={SETTINGS_ROUTE + '#Profile'}>
            <a>settings page</a>
          </Link>
          .
        </div>
      )}
      <div className="is-clearfix mb-5">
        <div className="is-pulled-left mr-3">
          <ProfilePic
            size="is-128x128"
            user={{ name: profile.name, image: profile.image_url }}
            isCentered={false}
          />
        </div>
        <div className="is-pulled-left">
          <Title className="mb-2">{profile.name}</Title>
          <div className="tags mb-0">
            {profile.school
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((school) => (
                <span className="tag is-info">{school.name}</span>
              ))}
          </div>
          <div className="tags mb-0">
            {profile.major
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((major) => (
                <span className="tag is-info is-light">{major.name}</span>
              ))}
          </div>
          <div>
            <b>Username:</b>{' '}
            <span className="is-family-monospace">{profile.username}</span>
          </div>
          <div>
            <b>Graduation Year:</b> {profile.graduation_year ?? 'Unknown'}{' '}
            <GraduationYearTag year={profile.graduation_year} />
          </div>
          <div>
            <b>Email:</b> <Contact email={profile.email} />
          </div>
        </div>
      </div>
      <Subtitle>{OBJECT_NAME_TITLE}</Subtitle>
      <div className="columns is-multiline is-desktop is-tablet">
        {profile.clubs.map((club) => {
          return (
            <div key={club.code} className="column is-half-desktop is-clearfix">
              <ClubCard fullWidth club={club} />
              <ClubCardAddon
                active={club.membership.active}
                rank={club.membership.role}
              >
                {club.membership.active ? club.membership.title : 'Alumni'}
              </ClubCardAddon>
            </div>
          )
        })}
      </div>
    </Container>
  )
}

UserProfilePage.getInitialProps = async (
  ctx: NextPageContext,
): Promise<{ profile: UserProfile }> => {
  const { query, req } = ctx
  const data = {
    headers: req ? { cookie: req.headers.cookie } : undefined,
  }

  const resp = await doApiRequest(
    `/users/${encodeURIComponent(query.user as string)}/?format=json`,
    data,
  )
  const respData = await resp.json()

  return { profile: respData }
}

export default renderPage(UserProfilePage)
