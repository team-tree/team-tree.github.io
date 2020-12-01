describe('My First Test', function() {
    it('Visits website', function() {
        cy.visit('https://team-tree.github.io')

        cy.contains('Final Stick').click()

        // Should be on a new URL which includes given string
        cy.url().should('include', '/stick_it4.0/game')
        cy.wait(400)
        cy.get('img').click('center')

        // in game
        cy.get('#body').type('d')
        cy.wait(100)
        cy.get('#body').type('d')
        cy.wait(100)
        cy.get('#body').type('d')

        //in first level
        cy.get('#body').type('dddd')
        cy.get('#body').type('wwwwww')
        cy.get('#body').type('dddddd')
        cy.get('#body').type('wwwwww')
        cy.get('#body').type('ddd')
        cy.wait(1000)

        // back in hub
        cy.get('#body').type(' ')
        cy.get('#body').type(' ')
        cy.get('#body').type(' ')
        cy.get('#body').type(' ')
        cy.get('#body').type(' ')
        cy.get('#body').type('d')
        cy.get('#body').type('s')
        cy.get('#body').type(' ')
        cy.get('#body').type('d')
        cy.get('#body').type('s')
        cy.get('#body').type(' ')
        cy.get('#body').type('d')
        cy.get('#body').type('s')
        cy.get('#body').type(' ')
        cy.get('#body').type('d')
        cy.get('#body').type('s')
        cy.get('#body').type(' ')
        cy.get('#body').type('d')
        cy.get('#body').type('d')
        cy.get('#body').type('d')
        
    })
  })