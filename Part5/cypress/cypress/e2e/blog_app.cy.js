describe('Blog app', function() {
  beforeEach(function() {
    cy.visit('http://localhost:5173')
  })
  it('Login form is shown', function() {
    cy.get('#username').type('June')
    cy.get('#password').type('salainen')
    cy.get('#login-button').click()
    cy.contains('June logged-in')
    
  })
})