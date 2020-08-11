import { NextPageContext } from 'next'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import s from 'styled-components'

import ClubMetadata from '../../../components/ClubMetadata'
import {
  DesktopActions,
  MobileActions,
} from '../../../components/ClubPage/Actions'
import Description from '../../../components/ClubPage/Description'
import Events from '../../../components/ClubPage/Events'
import Header from '../../../components/ClubPage/Header'
import InfoBox from '../../../components/ClubPage/InfoBox'
import MemberList from '../../../components/ClubPage/MemberList'
import QuestionList from '../../../components/ClubPage/QuestionList'
import RenewalRequest from '../../../components/ClubPage/RenewalRequest'
import SocialIcons from '../../../components/ClubPage/SocialIcons'
import Testimonials from '../../../components/ClubPage/Testimonials'
import {
  Card,
  Contact,
  Container,
  Flex,
  Icon,
  Metadata,
  StrongText,
  Text,
  Title,
  WideContainer,
} from '../../../components/common'
import { CLUBS_RED, SNOW, WHITE } from '../../../constants/colors'
import { M0, M2, M3 } from '../../../constants/measurements'
import renderPage from '../../../renderPage'
import { Club, UserInfo } from '../../../types'
import { doApiRequest } from '../../../utils'
import { logEvent } from '../../../utils/analytics'

const Image = s.img`
  height: 86px;
  width: auto;
  max-width: 242px;
  margin-right: 1rem;
  object-fit: contain;
`

const StyledCard = s(Card)`
  background-color: ${WHITE};
  margin-bottom: ${M3};
  padding-left: ${M2};
`

const InactiveCard = s(Card)`
  background-color: ${CLUBS_RED};
  margin-bottom: ${M3};
  padding-left: ${M2};
`

type ClubPageProps = {
  club: Club
  userInfo: UserInfo
}

const ClubPage = ({
  club: initialClub,
  userInfo,
}: ClubPageProps): ReactElement => {
  const router = useRouter()
  const [club, setClub] = useState<Club>(initialClub)

  const updateRequests = (code: string): void => {
    const newClub = Object.assign({}, club)
    logEvent(!newClub.is_request ? 'request' : 'unrequest', code)
    const req = !newClub.is_request
      ? doApiRequest('/requests/?format=json', {
          method: 'POST',
          body: {
            club: code,
          },
        })
      : doApiRequest(`/requests/${code}/?format=json`, {
          method: 'DELETE',
        })

    req.then(() => {
      newClub.is_request = !newClub.is_request
      setClub(newClub)
    })
  }

  const { code } = club
  if (!code) {
    return (
      <Container>
        <Metadata />
        <div className="has-text-centered">
          <Title>404 Not Found</Title>
          <Text>The club you are looking for does not exist.</Text>
        </div>
      </Container>
    )
  }

  const { image_url: image } = club
  const year = new Date().getFullYear()

  return (
    <WideContainer background={SNOW} fullHeight>
      <ClubMetadata club={club} />
      {club.active && club.approved !== true ? (
        <div className="notification is-warning">
          <Text>
            {club.approved === false ? (
              <span>
                This club has been marked as <b>rejected</b> and is only visible
                to administrators of Penn Clubs. If you believe that this is a
                mistake, contact <Contact />.
              </span>
            ) : (
              <span>
                <p>
                  This club has <b>not been approved yet</b> for the {year}-
                  {year + 1} school year and is only visible to club members and
                  administrators of Penn Clubs.
                </p>
              </span>
            )}
          </Text>
          {userInfo.is_superuser && (
            <>
              <div className="mb-3">
                As an administrator for Penn Clubs, you can approve or reject
                this request.
              </div>
              <div className="buttons">
                <button
                  className="button is-success"
                  onClick={() => {
                    doApiRequest(`/clubs/${club.code}/?format=json`, {
                      method: 'PATCH',
                      body: {
                        approved: true,
                      },
                    })
                      .then((resp) => resp.json())
                      .then(() => router.reload())
                  }}
                >
                  <Icon name="check" /> Approve
                </button>
                {club.approved !== false && (
                  <button
                    className="button is-danger"
                    onClick={() => {
                      doApiRequest(`/clubs/${club.code}/?format=json`, {
                        method: 'PATCH',
                        body: {
                          approved: false,
                        },
                      })
                        .then((resp) => resp.json())
                        .then(() => router.reload())
                    }}
                  >
                    <Icon name="x" /> Reject
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        <div />
      )}
      <div className="columns">
        <div className="column">
          {club.active || (
            <InactiveCard
              bordered
              style={{
                paddingLeft: '1rem',
              }}
            >
              <RenewalRequest club={club} />
            </InactiveCard>
          )}

          <StyledCard
            bordered
            style={{
              paddingLeft: '1rem',
            }}
          >
            <Flex>
              {image && <Image src={image} />}
              <Header club={club} style={{ flex: 1 }} />
            </Flex>
          </StyledCard>
          <MobileActions
            club={club}
            userInfo={userInfo}
            updateRequests={updateRequests}
          />
          <StyledCard bordered>
            <Description club={club} />
          </StyledCard>
          <StrongText>Members</StrongText>
          <MemberList club={club} />
          <StrongText>FAQ</StrongText>
          <QuestionList club={club} />
        </div>
        <div className="column is-one-third">
          <DesktopActions
            club={club}
            userInfo={userInfo}
            updateRequests={updateRequests}
          />
          <StyledCard bordered>
            <StrongText>Basic Info</StrongText>
            <InfoBox club={club} />
            <br />
            <StrongText>Contact</StrongText>
            <SocialIcons club={club} />
          </StyledCard>
          {club.how_to_get_involved ? (
            <StyledCard bordered>
              <StrongText>How To Get Involved</StrongText>
              <Text style={{ marginBottom: M0 }}>
                {' '}
                {club.how_to_get_involved}{' '}
              </Text>
            </StyledCard>
          ) : (
            <div></div>
          )}
          <Events data={club.events} />
          <Testimonials data={club.testimonials} />
        </div>
      </div>
    </WideContainer>
  )
}

ClubPage.getInitialProps = async (ctx: NextPageContext) => {
  const { query, req } = ctx
  const data = {
    headers: req ? { cookie: req.headers.cookie } : undefined,
  }
  const resp = await doApiRequest(`/clubs/${query.club}/?format=json`, data)
  const club = await resp.json()
  return { club }
}

export default renderPage(ClubPage)
