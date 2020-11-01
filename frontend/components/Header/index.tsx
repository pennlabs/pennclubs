import Link from 'next/link'
import { ReactElement, useState } from 'react'
import s from 'styled-components'

import { BANNER_BG, BANNER_TEXT, BORDER } from '../../constants/colors'
import {
  ANIMATION_DURATION,
  BANNER_HEIGHT,
  FULL_NAV_HEIGHT,
  HEADER_SHADOW,
  LOGO_SCALE,
  MD,
  mediaMaxWidth,
  NAV_HEIGHT,
  TITLE_MARGIN,
  TITLE_SIZE,
  TITLE_WEIGHT,
} from '../../constants/measurements'
import { HOME_ROUTE } from '../../constants/routes'
import { UserInfo } from '../../types'
import {
  HEADER_BACKGROUND_IMAGE,
  HEADER_OVERLAY,
  SITE_LOGO,
  SITE_NAME,
} from '../../utils/branding'
import Burger from './Burger'
import Feedback from './Feedback'
import Heading from './Head'
import Links from './Links'

const Nav = s.nav`
  height: ${NAV_HEIGHT};
  background-color: ${BANNER_BG} !important;
  border-bottom: 1px solid ${BORDER};
  box-shadow: 0 1px 4px 0 ${BORDER};
  width: 100%;
  position: fixed;
  z-index: 1001;
  box-shadow: ${HEADER_SHADOW};

  ${mediaMaxWidth(MD)} {
    box-shadow: none;
  }
`

const ImageHead = s.div`
  height: ${BANNER_HEIGHT};
  background-color: ${BANNER_BG};
  background-image: url('${HEADER_BACKGROUND_IMAGE}');
  box-shadow: 0 1px 4px 0 ${BORDER};
  width: 100%;
  position: fixed;
  top:${NAV_HEIGHT};
  z-index: 999;
  background-size: auto 100%;
  background-repeat: no-repeat center center fixed;
  padding: 1em;

  ${mediaMaxWidth(MD)} {
    box-shadow: none;
  }
`

const Overlay = s.div`
  background: url('${HEADER_OVERLAY}');
  width: 50%;
  height:12rem;
  position: fixed;
  z-index: 999;
  background-size: auto 100%;
  background-repeat: no-repeat;
  padding: 1em;
  left: 16rem;
  top: -1.5em;

  ${mediaMaxWidth(MD)} {
    box-shadow: none;
  }
`

const NavSpacer = s.div`
  width: 100%;
  display: block;
  height: ${FULL_NAV_HEIGHT};
`

const Logo = s.img`
  padding-left: 20px;
  height: 100%;
  transform: scale(${LOGO_SCALE});
  transition: transform ${ANIMATION_DURATION} ease;

  &:hover {
    transform: scale(${parseFloat(LOGO_SCALE) * 1.1});
  }

  ${mediaMaxWidth(MD)} {
    padding-left: 1rem;
  }
`

const Title = s.h1`
  color: ${BANNER_TEXT};
  padding-left: ${TITLE_MARGIN};
  margin-bottom: 0 !important;
  font-size: ${TITLE_SIZE};
  font-weight: ${TITLE_WEIGHT};
`

const LogoBackground = s.div<{ use?: boolean }>`
  ${({ use }) =>
    use
      ? `
  background: url('${HEADER_BACKGROUND_IMAGE}');
  background-size: auto 100%;
  width: 500px;
  background-repeat: no-repeat;
  padding: 1em;
  `
      : `padding: 0.5em;`}
`

type HeaderProps = {
  authenticated: boolean | null
  userInfo?: UserInfo
}

const Header = ({ authenticated, userInfo }: HeaderProps): ReactElement => {
  const [show, setShow] = useState(false)

  const toggle = () => setShow(!show)

  return (
    <>
      <Heading />

      <NavSpacer />

      <Nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link href={HOME_ROUTE}>
            <a className="navbar-item" style={{ padding: 0 }}>
              <Logo src={SITE_LOGO} alt={`${SITE_NAME} Logo`} />
              <Title>{SITE_NAME}</Title>
            </a>
          </Link>
          {SITE_NAME === 'Hub@Penn' && <ImageHead />}
          {SITE_NAME === 'Hub@Penn' && <Overlay />}

          <Burger toggle={toggle} />
        </div>

        <Links userInfo={userInfo} authenticated={authenticated} show={show} />
      </Nav>

      <Feedback />
    </>
  )
}

export default Header
