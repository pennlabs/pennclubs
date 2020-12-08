import equal from 'deep-equal'
import { ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { CLUB_RECRUITMENT_CYCLES } from '../components/ClubEditPage/ClubEditCard'
import ListRenewalDialog from '../components/ClubPage/ListRenewalDialog'
import LiveEventsDialog from '../components/ClubPage/LiveEventsDialog'
import { Metadata, Title, WideContainer } from '../components/common'
import DisplayButtons from '../components/DisplayButtons'
import { FuseTag } from '../components/FilterSearch'
import PaginatedClubDisplay from '../components/PaginatedClubDisplay'
import SearchBar, {
  SearchBarCheckboxItem,
  SearchBarOptionItem,
  SearchbarRightContainer,
  SearchBarTagItem,
  SearchBarTextItem,
  SearchInput,
} from '../components/SearchBar'
import { mediaMaxWidth, PHONE } from '../constants'
import {
  CLUBS_BLUE,
  CLUBS_GREY_LIGHT,
  CLUBS_PURPLE,
  FOCUS_GRAY,
  H1_TEXT,
  SNOW,
  TAG_BACKGROUND_COLOR_MAP,
  TAG_TEXT_COLOR_MAP,
} from '../constants/colors'
import { PaginatedClubPage, renderListPage } from '../renderPage'
import { Badge, School, StudentType, Tag, UserInfo, Year } from '../types'
import { doApiRequest, isClubFieldShown, useSetting } from '../utils'
import { OBJECT_NAME_TITLE, SITE_TAGLINE } from '../utils/branding'

const ClearAllLink = styled.span`
  cursor: pointer;
  color: ${CLUBS_GREY_LIGHT};
  text-decoration: none !important;
  background: transparent !important;
  fontsize: 0.7em;
  margin: 5px;

  &:hover {
    background: ${FOCUS_GRAY} !important;
  }
`

const ResultsText = styled.div`
  color: ${CLUBS_GREY_LIGHT};
  text-decoration: none !important;
  background: transparent !important;
  fontsize: 0.7em;
  margin: 5px;

  ${mediaMaxWidth(PHONE)} {
    margin-bottom: 1rem;
  }
`

type SplashProps = {
  userInfo: UserInfo
  clubs: PaginatedClubPage
  tags: Tag[]
  badges: Badge[]
  schools: School[]
  years: Year[]
  studentTypes: StudentType[]
  clubCount: number
  liveEventCount: number
}

export const ListLoadIndicator = (): ReactElement => {
  return (
    <progress className="progress is-small" max={100}>
      Loading...
    </progress>
  )
}

const SearchTags = ({
  searchInput,
  setSearchInput,
  optionMapping,
}): ReactElement => {
  const tags = Object.keys(optionMapping)
    .map((param) => {
      return (searchInput[param] ?? '')
        .trim()
        .split(',')
        .filter((val: string): boolean => val.length > 0)
        .map((value: string) =>
          optionMapping[param].find((tag) => tag.value.toString() === value),
        )
        .filter((tag) => tag !== undefined)
        .map((tag) => {
          tag.name = param
          return tag
        })
    })
    .flat()

  return (
    <>
      {!!tags.length && (
        <div style={{ padding: '0 30px 30px 0' }}>
          {tags.map((tag) => {
            return (
              <span
                key={`${tag.value} ${tag.label}`}
                className="tag is-rounded"
                style={{
                  color: TAG_TEXT_COLOR_MAP[tag.name] ?? 'white',
                  backgroundColor:
                    TAG_BACKGROUND_COLOR_MAP[tag.name] ?? CLUBS_PURPLE,
                  fontWeight: 600,
                  margin: 3,
                }}
              >
                {tag.label}
                <button
                  className="delete is-small"
                  onClick={() => {
                    const newTags = searchInput[tag.name]
                      .split(',')
                      .filter((t) => t.value === tag.value)
                      .join(',')
                    if (newTags.length > 0) {
                      setSearchInput((inpt) => ({
                        ...inpt,
                        [tag.name]: newTags,
                      }))
                    } else {
                      setSearchInput((inpt) => {
                        const newInpt = { ...inpt }
                        delete newInpt[tag.name]
                        return newInpt
                      })
                    }
                  }}
                />
              </span>
            )
          })}
          <ClearAllLink
            className="tag is-rounded"
            onClick={() =>
              setSearchInput((inpt) => {
                const newInpt = { ...inpt }
                Object.keys(newInpt)
                  .filter((param) => param in optionMapping)
                  .forEach((key) => {
                    if (key in newInpt) {
                      delete newInpt[key]
                    }
                  })
                return newInpt
              })
            }
          >
            Clear All
          </ClearAllLink>
        </div>
      )}
    </>
  )
}

const Splash = (props: SplashProps): ReactElement => {
  const fairIsOpen = useSetting('FAIR_OPEN')
  const preFair = useSetting('PRE_FAIR')
  const renewalBanner = useSetting('CLUB_REGISTRATION')
  const currentSearch = useRef<SearchInput>({})

  const [clubs, setClubs] = useState<PaginatedClubPage>(props.clubs)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [searchInput, setSearchInput] = useState<SearchInput>({})
  const [display, setDisplay] = useState<'cards' | 'list'>('cards')

  useEffect((): void => {
    if (equal(searchInput, currentSearch.current)) {
      return
    }

    currentSearch.current = { ...searchInput }

    setLoading(true)

    const params = new URLSearchParams()
    params.set('format', 'json')
    params.set('page', '1')

    Object.entries(searchInput).forEach(([key, value]) => {
      params.set(key, value)
    })

    doApiRequest(`/clubs/?${params.toString()}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((displayClubs) => {
        if (equal(currentSearch.current, searchInput)) {
          setClubs(displayClubs)
          setLoading(false)
        }
      })
  }, [searchInput])

  const tagOptions = useMemo<FuseTag[]>(
    () =>
      props.tags.map(({ id, name, clubs }) => ({
        value: id,
        label: name,
        count: clubs,
      })),
    [props.tags],
  )

  const badgeOptions = useMemo<FuseTag[]>(
    () =>
      props.badges.map(({ id, label, color, description }) => ({
        value: id,
        label,
        color,
        description,
      })),
    [props.badges],
  )

  const applicationRequiredOptions = [
    { value: 1, label: 'Open Membership', name: 'app' },
    {
      value: 2,
      label: 'Tryout Required',
      name: 'app',
    },
    {
      value: 3,
      label: 'Audition Required',
      name: 'app',
    },
    {
      value: 4,
      label: 'Application Required',
      name: 'app',
    },
    {
      value: 5,
      label: 'Application and Interview Required',
      name: 'app',
    },
  ]

  const sizeOptions = [
    { value: 1, label: 'less than 20 members', name: 'size' },
    { value: 2, label: '20 to 50 members', name: 'size' },
    { value: 3, label: '50 to 100 members', name: 'size' },
    { value: 4, label: 'more than 100', name: 'size' },
  ]

  const schoolOptions = props.schools.map(({ id, name, is_graduate }) => ({
    value: id,
    label: name,
    name: 'school',
    color: is_graduate ? CLUBS_BLUE : undefined,
  }))

  const yearOptions = props.years.map(({ id, name }) => ({
    value: id,
    label: name,
    name: 'year',
  }))

  const studentTypeOptions = props.studentTypes.map(({ id, name }) => ({
    value: id,
    label: name,
    name: 'student_type',
  }))

  const recruitingCycleOptions = CLUB_RECRUITMENT_CYCLES.map((item) => ({
    ...item,
    name: 'cycle',
  }))

  return (
    <>
      <Metadata />
      <div style={{ backgroundColor: SNOW }}>
        <SearchBar updateSearch={setSearchInput} searchInput={searchInput}>
          <SearchBarTextItem param="search" />
          <SearchBarTagItem
            param="tags__in"
            label="Tags"
            options={tagOptions}
          />
          <SearchBarTagItem
            param="badges__in"
            label="Badges"
            options={badgeOptions}
          />
          <SearchBarOptionItem param="ordering" label="Ordering" />
          {isClubFieldShown('application_required') && (
            <SearchBarCheckboxItem
              param="application_required__in"
              label="General Membership Process"
              options={applicationRequiredOptions}
            />
          )}
          {isClubFieldShown('size') && (
            <SearchBarCheckboxItem
              param="size__in"
              label="Size"
              options={sizeOptions}
            />
          )}
          {isClubFieldShown('accepting_members') && (
            <SearchBarCheckboxItem
              param="accepting_members"
              label="Accepting Members"
              options={[
                {
                  value: 'true',
                  label: 'Is Accepting Members',
                  name: 'accept',
                },
              ]}
            />
          )}
          {isClubFieldShown('recruiting_cycle') && (
            <SearchBarCheckboxItem
              param="recruiting_cycle__in"
              label="Recruiting Cycle"
              options={recruitingCycleOptions}
            />
          )}
          {isClubFieldShown('available_virtually') && (
            <SearchBarCheckboxItem
              param="available_virtually__in"
              label="Available Virtually"
              options={[
                { value: 'true', label: 'Yes', name: 'virtual' },
                { value: 'false', label: 'No', name: 'virtual' },
              ]}
            />
          )}
          {isClubFieldShown('appointment_needed') && (
            <SearchBarCheckboxItem
              param="appointment_needed__in"
              label="Appointment Needed"
              options={[
                { value: 'true', label: 'Yes', name: 'virtual' },
                { value: 'false', label: 'No', name: 'virtual' },
              ]}
            />
          )}
          <SearchBarCheckboxItem
            param="target_schools__in"
            label="School"
            options={schoolOptions}
          />
          <SearchBarCheckboxItem
            param="target_years__in"
            label="School Year"
            options={yearOptions}
          />
          {isClubFieldShown('student_types') && (
            <SearchBarCheckboxItem
              param="student_types__in"
              label="Student Type"
              options={studentTypeOptions}
            />
          )}
        </SearchBar>

        <SearchbarRightContainer>
          <WideContainer background={SNOW} fullHeight>
            <div style={{ padding: '30px 0' }}>
              <DisplayButtons switchDisplay={setDisplay} />

              <Title className="title" style={{ color: H1_TEXT }}>
                Browse {OBJECT_NAME_TITLE}
              </Title>
              <p
                className="subtitle is-size-5"
                style={{ color: CLUBS_GREY_LIGHT }}
              >
                {SITE_TAGLINE}
              </p>
            </div>
            <ResultsText>
              {' '}
              {clubs.count} result{clubs.count === 1 ? '' : 's'}
            </ResultsText>

            <SearchTags
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              optionMapping={{
                tags__in: tagOptions,
                badges__in: badgeOptions,
                application_required__in: applicationRequiredOptions,
                size__in: sizeOptions,
                target_schools__in: schoolOptions,
                target_years__in: yearOptions,
                student_types__in: studentTypeOptions,
                recruiting_cycle__in: recruitingCycleOptions,
              }}
            />

            {(preFair || fairIsOpen) && (
              <LiveEventsDialog
                isPreFair={!!preFair}
                isFair={!!fairIsOpen}
                liveEventCount={props.liveEventCount}
              />
            )}
            {renewalBanner && <ListRenewalDialog />}

            {isLoading && <ListLoadIndicator />}

            <PaginatedClubDisplay
              displayClubs={clubs}
              display={display}
              tags={props.tags}
            />
          </WideContainer>
        </SearchbarRightContainer>
      </div>
    </>
  )
}

export default renderListPage(Splash)
