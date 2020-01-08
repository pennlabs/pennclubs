import s from 'styled-components'
import { useState } from 'react'
import renderPage from '../renderPage.js'
import { Icon, Flex } from '../components/common'
import { API_BASE_URL } from '../utils'
import { Sidebar } from '../components/common/Sidebar'
import Checkbox from '../components/common/Checkbox'
import { Container, WideContainer } from '../components/common/Container'
import {
  CLUBS_GREY,
  RED,
  ALLBIRDS_GRAY,
  MEDIUM_GRAY,
} from '../constants/colors'

const TallTextArea = s.textarea`
  height: 6em;
`

const GroupLabel = s.h4`
  margin-top: 1em;
  margin-bottom: 0em !important;
  font-size: 32px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.8px;
  color: #626572;
`

const HoverListElement = s.li`

  span {
    display: none;
  }

  &:hover span {
    display: inline;
    cursor: pointer;
  }

`

const SelectedManager = ({ value, onClick }) => (
  <HoverListElement>
    {value}

    <span style={{ marginLeft: '1em' }} onClick={onClick}>
      X
    </span>
  </HoverListElement>
)

const Reports = () => {
  const fields = {
    // TODO: Get this from the server.
    Basics: [
      'Name',
      'Subtitle',
      'Description',
      'Date Founded',
      'Size',
      'Activity',
      'Approval Status',
      'Parent Orgs',
      'How to Get Involved',
      'Tags',
    ],
    'Additional Links': [
      'Website',
      'Facebook',
      'Instagram',
      'Twitter',
      'Github',
      'Linkedin',
    ],
    'Contact Information': [
      'Owner name(s)',
      'Owner email(s)',
      'Listserv',
      'Officer name(s)',
      'Officer email(s)',
    ],
  }

  const nameToCode = {
    Id: 'id',
    Code: 'code',
    Active: 'active',
    Approved: 'approved',
    Name: 'name',
    Subtitle: 'subtitle',
    Description: 'description',
    'Date Founded': 'founded',
    Size: 'size',
    Email: 'email',
    Facebook: 'facebook',
    Website: 'website',
    Twitter: 'twitter',
    Instagram: 'instagram',
    Linkedin: 'linkedin',
    Github: 'github',
    'How To Get Involved': 'how_to_get_involved',
    'Application Required': 'application_required',
    'Accepting Members': 'accepting_members',
    Listserv: 'listserv',
    Image: 'image',
    'Created At': 'created_at',
    'Updated At': 'updated_at',
    Tags: 'tags',
    Members: 'members',
    'Parent Orgs': 'parent_orgs',
    Badges: 'badges',
  }

  const [includedFields, setIncludedFields] = useState(
    (() => {
      const initial = {}
      Object.keys(fields).forEach(group =>
        fields[group].forEach(f => {
          initial[f] = false
        })
      )
      return initial
    })()
  )

  const query = {
    format: 'xlsx',
    fields: Object.keys(includedFields)
      .filter(field => includedFields[field])
      .map(name => nameToCode[name])
      .filter(e => e !== undefined),
  }

  const generateCheckboxGroup = (groupName, fields) => {
    return (
      <div style={{ flexBasis: '50%', flexShrink: 0 }}>
        <GroupLabel
          key={groupName}
          className="subtitle is-4"
          style={{ color: CLUBS_GREY }}
        >
          {groupName}
        </GroupLabel>
        {fields.map((field, idx) => (
          <div>
            <Checkbox
              id={field}
              key={idx}
              checked={includedFields[field]}
              onChange={() => {
                setIncludedFields(prev => ({ ...prev, [field]: !prev[field] }))
              }}
            />
            {'  '}
            <label htmlFor={field}>{field}</label>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <Sidebar>
        <hr />
        <h4 className="title is-4" style={{ color: MEDIUM_GRAY }}>
          Fields
        </h4>
        <ul>
          {Object.keys(includedFields).map(f =>
            includedFields[f] ? (
              <SelectedManager
                value={f}
                onClick={() =>
                  setIncludedFields(prev => ({ ...prev, [f]: false }))
                }
              />
            ) : null
          )}
        </ul>
      </Sidebar>
      <Container>
        <WideContainer>
          <h1 className="title" style={{ color: CLUBS_GREY }}>
            Create a new report
          </h1>
          <div className="box">
            <h3 className="title is-4" style={{ color: CLUBS_GREY }}>
              Report Details
            </h3>
            <div>
              <div className="field">
                <label className="label">Name</label>
                <div className="control">
                  <input
                    name="name"
                    className="input"
                    type="text"
                    placeholder='e.g. "Owner emails"'
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Description</label>
                <div className="control">
                  <TallTextArea
                    name="description"
                    className="input"
                    type="text"
                    placeholder='e.g. "Pulls all clubs, the emails from club owners, and names of owners"'
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="box">
            <h3 className="title is-4" style={{ color: CLUBS_GREY }}>
              Select fields to include
            </h3>
            <div>
              <Flex>
                {Object.keys(fields).map(group =>
                  generateCheckboxGroup(group, fields[group])
                )}
              </Flex>
            </div>
          </div>
          <button
            className="button is-info"
            onClick={() => {
              window.open(
                `${API_BASE_URL}/reports?format=xlsx&fields=${query.fields.join(
                  ','
                )}`,
                '_blank'
              )
            }}
          >
            Generate Report
          </button>
        </WideContainer>
      </Container>
    </div>
  )
}

export default renderPage(Reports)
