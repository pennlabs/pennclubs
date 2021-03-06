import { NextPageContext } from 'next'

import ClubEditPage from '../components/ClubEditPage'
import ResourceCreationPage from '../components/ResourceCreationPage'
import renderPage from '../renderPage'
import { doBulkLookup } from '../utils'
import { SITE_ID } from '../utils/branding'

const Create = (props) =>
  SITE_ID === 'fyh' ? (
    <ResourceCreationPage {...props} />
  ) : (
    <ClubEditPage {...props} />
  )

Create.getInitialProps = async (ctx: NextPageContext) => {
  return doBulkLookup(
    ['tags', 'schools', 'majors', 'years', 'student_types'],
    ctx,
  )
}

export default renderPage(Create)
