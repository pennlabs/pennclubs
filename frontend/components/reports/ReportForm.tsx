import { Field, Form, Formik } from 'formik'
import { ReactElement } from 'react'
import styled from 'styled-components'

import { Flex, Icon, Text } from '../../components/common'
import { Badge, Report } from '../../types'
import { API_BASE_URL } from '../../utils'
import { OBJECT_NAME_PLURAL } from '../../utils/branding'
import { CheckboxField, SelectField, TextField } from '../FormComponents'

const ReportContainer = styled.div`
  margin: 15px auto;
  padding: 15px;
  max-width: 800px;
`

const ReportBox = ({
  children,
  title,
}: React.PropsWithChildren<{ title: ReactElement | string }>): ReactElement => {
  return (
    <div className="box">
      <h3 className="title is-4">{title}</h3>
      {children}
    </div>
  )
}

type Props = {
  fields: { [key: string]: string[] }
  generateCheckboxGroup: (key: string, fields: string[]) => ReactElement
  query: { fields: string[] }
  initial?: Report
  onSubmit: () => void
  badges: Badge[]
}

const ReportForm = ({
  fields,
  generateCheckboxGroup,
  query,
  onSubmit,
  initial,
  badges,
}: Props): ReactElement => {
  const handleGenerateReport = (
    data: Partial<{
      name: string
      description: string
      public: boolean
      badges__in: { id: number }[]
    }>,
  ): void => {
    const formattedParamsDict: { [key: string]: string } = {
      name: data.name ?? '',
      desc: data.description ?? '',
      public: data.public?.toString() ?? 'false',
    }

    if (data.badges__in && data.badges__in.length) {
      if (typeof data.badges__in === 'string') {
        formattedParamsDict.badges__in = data.badges__in
      } else {
        formattedParamsDict.badges__in = data.badges__in
          .map(({ id }) => id.toString())
          .join(',')
      }
    }

    const params = new URLSearchParams(formattedParamsDict).toString()

    window.open(
      `${API_BASE_URL}/clubs/?format=xlsx&${params}&fields=${encodeURIComponent(
        query.fields.join(','),
      )}`,
      '_blank',
    )
    onSubmit()
  }

  return (
    <ReportContainer>
      <Formik
        initialValues={
          initial != null
            ? { ...JSON.parse(initial.parameters), ...initial }
            : {}
        }
        onSubmit={handleGenerateReport}
        enableReinitialize
      >
        <Form>
          <ReportBox title="Report Details">
            <Text>
              All report detail fields are optional. If you do not specify a
              report name, a temporary report will be generated and you will not
              be able to rerun the report.
            </Text>
            <div>
              <Field
                name="name"
                as={TextField}
                disabled={!!initial?.name}
                helpText="This will be shown in the table view on the list of reports."
              />
              <Field
                name="description"
                as={TextField}
                type="textarea"
                helpText="Use this field to note down additional information about this generated report."
              />
              <Field
                name="public"
                as={CheckboxField}
                label="Show this report to other users that can generate reports."
              />
            </div>
          </ReportBox>
          <ReportBox title="Filters">
            <Text>
              You can specify filters below to only include specific{' '}
              {OBJECT_NAME_PLURAL} in your report. Any fields you leave blank
              will not be applied as filters.
            </Text>
            <Field
              name="badges__in"
              label="Badges"
              as={SelectField}
              choices={badges}
              valueDeserialize={(value) => {
                if (typeof value === 'string') {
                  return value
                    .trim()
                    .split(',')
                    .filter((tag) => tag.length > 0)
                    .map((tag) => {
                      const id = parseInt(tag)
                      const trueVal = badges.find((oth) => oth.id === id)
                      return trueVal != null
                        ? trueVal
                        : { id, label: 'Unknown' }
                    })
                }
                if (Array.isArray(value)) {
                  return value.map(({ id, name }) => ({ id, label: name }))
                }
                return []
              }}
              isMulti
              helpText={`Select only ${OBJECT_NAME_PLURAL} with all of the specified badges.`}
            />
          </ReportBox>
          <ReportBox title="Included Fields">
            <Text>
              Select the fields you want to include below as columns in the
              generated spreadsheet file.
            </Text>
            {fields ? (
              <Flex>
                {Object.keys(fields)
                  .sort()
                  .map((group) => generateCheckboxGroup(group, fields[group]))}
              </Flex>
            ) : null}
          </ReportBox>
          <button className="button is-info" type="submit">
            <Icon name="paperclip" alt="report" />
            Generate Report
          </button>
        </Form>
      </Formik>
    </ReportContainer>
  )
}

export default ReportForm