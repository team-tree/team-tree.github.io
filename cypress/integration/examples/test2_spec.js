/// <reference types="Cypress" />


describe('My First Test', function() {
    it('Visits website', function() {

        cy.visit('https://polyplexus.com/')
        cy.get('nav:first').children('span').click()

        cy.get('div.top-nav-menu').should('have.class', 'top-nav-menu')
        cy.get('.top-nav-menu').children().get('ul').should('have.length', '4')
        

        cy.get('ul.list-group').contains('Create').click()

        cy.url().should('include', 'listView')

    })
})
