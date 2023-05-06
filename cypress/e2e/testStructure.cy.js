/// <reference types="cypress" />

describe('Context: My First Tests', () => {

    before(() => {
        // runs once before all test cases in this describe block ( like beforeClass in TestNG)
    })

    beforeEach(() => {
        // runs once before each test cases in this describe block ( like beforeMethod in TestNG)
    })
    after(() => {
        // runs ..
    })
    afterEach(() => {
        // runs ..
    })

    it('Opening a web application', () => {
        cy.visit('/registration_form');
      //  cy.get('.list-group > :nth-child(1) > a').click();
    })
    

})