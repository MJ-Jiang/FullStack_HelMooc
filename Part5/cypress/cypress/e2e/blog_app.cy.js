describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'June',
      username: 'June',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)

    cy.visit('http://localhost:5173')
  })
  it('Login form is shown', function() {
    cy.get('#username').should('be.visible')
    cy.get('#password').should('be.visible')
    cy.get('#login-button').should('be.visible')

  })
  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('June')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
      cy.contains('June logged-in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('June')
      cy.get('#password').type('xxxxx')
      cy.get('#login-button').click()
      cy.contains('Wrong username or password')
    })
  })
})

