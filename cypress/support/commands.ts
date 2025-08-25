/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Example of how to add custom commands:
// 
// Cypress.Commands.add('customCommand', (param) => {
//   cy.get('[data-cy="element"]').should('contain', param)
// })
//
// You can also overwrite existing commands:
// 
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
//   // Add custom logic before visiting
//   return originalFn(url, options)
// })
//
// TypeScript declarations for custom commands would go here:
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       customCommand(param: string): Chainable<void>
//     }
//   }
// }
