import { NextPageContext } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'

import ClubMetadata from '../../../../../components/ClubMetadata'
import { Contact, Metadata } from '../../../../../components/common'
import AuthPrompt from '../../../../../components/common/AuthPrompt'
import { CLUB_ROUTE } from '../../../../../constants/routes'
import renderPage from '../../../../../renderPage'
import { Club } from '../../../../../types'
import { doApiRequest, formatResponse } from '../../../../../utils'
import {
  OBJECT_NAME_SINGULAR,
  OBJECT_NAME_TITLE_SINGULAR,
  SHOW_MEMBERS,
} from '../../../../../utils/branding'

type Query = {
  club: string
  invite: string
  token: string
}

type InviteProps = {
  club: Club
  query: Query
  inviter: Inviter | null
  error: Error | null
}

type Inviter = {
  id: number
  name: string
  email: string
}

type Error = { [key: string]: string } | string

const Invite = ({
  club,
  query,
  inviter: initialInviter,
  error: initialError,
  authenticated,
}: InviteProps & { authenticated: boolean | null }): ReactElement => {
  const router = useRouter()
  const [isPublic, setIsPublic] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(initialError)
  const [inviter, setInviter] = useState<Inviter | null>(initialInviter)

  const accept = (isPublic: boolean) => {
    if (query.invite === 'example') {
      router.push(CLUB_ROUTE(), CLUB_ROUTE(query.club))
      return
    }

    doApiRequest(`/clubs/${query.club}/invites/${query.invite}/?format=json`, {
      method: 'PATCH',
      body: {
        token: query.token,
        public: isPublic,
      },
    }).then((resp) => {
      if (resp.ok) {
        router.push(CLUB_ROUTE(), CLUB_ROUTE(query.club))
      } else {
        resp.json().then((data) => {
          setInviter(null)
          setError(data)
        })
      }
    })
  }

  if (!authenticated) {
    return (
      <>
        <Metadata title={`${OBJECT_NAME_TITLE_SINGULAR} Invite`} />
        <AuthPrompt />
      </>
    )
  }

  if (!inviter || !club.code) {
    if (error) {
      return (
        <div
          className="has-text-centered"
          style={{ margin: 30, marginTop: 60 }}
        >
          <Metadata title={`${OBJECT_NAME_TITLE_SINGULAR} Invite`} />
          <h1 className="title is-2">404 Not Found</h1>
          <p>
            The invite you are looking for does not exist. Perhaps it was
            already claimed?
          </p>
          <p>
            If you believe that this is an error, please contact <Contact />.
          </p>
          <p>{error && formatResponse(error)}</p>
        </div>
      )
    } else {
      return (
        <div
          className="has-text-centered"
          style={{ margin: 30, marginTop: 60 }}
        >
          <ClubMetadata club={club} />
          <h1 className="title is-2">Loading...</h1>
          <p>Processing your invitation...</p>
        </div>
      )
    }
  }

  const { name, code, image_url: image } = club

  return (
    <div style={{ padding: '30px 50px' }} className="has-text-centered">
      <ClubMetadata club={club} />
      {/* &#x1F389; is the confetti emoji. */}
      <h2 className="title is-2">&#x1F389; Invitation for {name} &#x1F389;</h2>
      <div className="title is-4" style={{ fontWeight: 'normal' }}>
        <b>{inviter.name}</b> has invited you, <b>{inviter.email}</b>, to join{' '}
        <Link href={CLUB_ROUTE()} as={CLUB_ROUTE(code)}>
          <a>{name}</a>
        </Link>
        .
      </div>
      {image && (
        <img
          src={image}
          alt={name}
          style={{ maxHeight: 100, marginBottom: 15 }}
        />
      )}
      <p style={{ marginBottom: 15 }}>
        By accepting this invitation, you will be able to view the contact
        information of other members and internal {OBJECT_NAME_SINGULAR}{' '}
        documents.
      </p>
      {SHOW_MEMBERS && (
        <p>
          <label>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={() => setIsPublic(!isPublic)}
            />{' '}
            Make my membership to this club public. Outsiders will be able to
            see my name and role in {name}.
          </label>
        </p>
      )}
      <br />
      <button
        className="button is-large is-success"
        onClick={() => accept(isPublic)}
      >
        Accept Invitation
      </button>
    </div>
  )
}

Invite.getInitialProps = async (ctx: NextPageContext): Promise<InviteProps> => {
  const { req, query } = ctx
  const reqData = {
    headers: req ? { cookie: req.headers.cookie } : undefined,
  }

  const clubRequest = await doApiRequest(
    `/clubs/${query.club}/?bypass=true&format=json`,
  )
  const clubResponse = await clubRequest.json()

  let inviter: Inviter | null = null
  let error: Error | null = null

  if (query.invite === 'example' && query.token === 'example') {
    inviter = {
      id: -1,
      name: '[Example name]',
      email: '[Example email]',
    }
  } else {
    const resp = await doApiRequest(
      `/clubs/${query.club}/invites/${query.invite}/?format=json`,
      reqData,
    )
    const data = await resp.json()
    if (resp.ok) {
      inviter = data
    } else {
      error = data
    }
  }

  return { query: query as Query, club: clubResponse, inviter, error }
}

export default renderPage(Invite)
