describe('Membership request tests', () => {
  it('Can successfully request membership', () => {
    // login to James Madison
    cy.login('jmadison', 'test')

    // request membership
    cy.visit('/club/pppjo/')
    cy.contains('.button:visible', /(I'm a Member|Request Membership)/).click()
    cy.contains('.button:visible', 'Confirm').click()

    cy.contains('Success!').should('be.visible')
  })

  it('Can successfully approve membership', () => {
    cy.logout()
    cy.login('bfranklin', 'test')

    // approve membership
    cy.visit('/club/pppjo/edit#member')
    cy.contains('Membership Requests').should('be.visible')
    
    cy.contains('.button:visible', 'Accept').click()
  })

  it('Can remove membership', () => {
    cy.logout()
    cy.login('jmadison', 'test')

    cy.visit('/settings')
    cy.get('table > tbody').contains('tr', 'Penn Pre-Professional Juggling Organization').contains('Leave').click()
  })
})