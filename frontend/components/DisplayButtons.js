import Link from 'next/link'
import PropTypes from 'prop-types'
import s from 'styled-components'

import { ALLBIRDS_GRAY, DARK_GRAY, WHITE } from '../constants/colors'
import { BODY_FONT } from '../constants/styles'
import { Icon } from './common'

const DisplayButtonsTag = s.div`
  float: right;
  font-family: ${BODY_FONT};

  .button {
    margin-left: 8px;
  }
`

const iconStyles = {
  transform: 'translateY(0px)',
  opacity: 0.6,
}

const buttonStyles = {
  backgroundColor: `${WHITE}`,
  border: `1px solid ${ALLBIRDS_GRAY}`,
  fontFamily: `${BODY_FONT}`,
}

const DisplayButtons = ({ switchDisplay, shuffle }) => (
  <DisplayButtonsTag>
    <button
      onClick={() => switchDisplay('cards')}
      className="button is-small"
      style={buttonStyles}
    >
      <Icon name="grid" alt="switch to grid view" style={iconStyles} />
    </button>
    <button
      onClick={() => switchDisplay('list')}
      className="button is-small"
      style={buttonStyles}
    >
      <Icon name="list" alt="switch to list view" style={iconStyles} />
    </button>
    <button
      onClick={shuffle}
      style={{ color: DARK_GRAY, fontWeight: 600 }}
      className="button is-small"
      style={buttonStyles}
    >
      <Icon name="shuffle" alt="shuffle club order" style={iconStyles} />
      &nbsp;&nbsp; Shuffle
    </button>
    <Link href="/create">
      <a className="button is-small is-success">
        <Icon name="plus" alt="create club" style={iconStyles} />
        Add Club
      </a>
    </Link>
  </DisplayButtonsTag>
)

DisplayButtons.propTypes = {
  switchDisplay: PropTypes.func.isRequired,
  shuffle: PropTypes.func.isRequired,
}

export default DisplayButtons
