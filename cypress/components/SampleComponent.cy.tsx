import React from 'react';
import SampleComponent from '../../src/Components/SampleComponent/sample-component';

describe('SampleComponent', () => {
  it('renders with children', () => {
    cy.mount(
      <SampleComponent>
        Hello, World!
      </SampleComponent>
    );
    
    cy.contains('Hello, World!').should('be.visible');
    cy.get('.sample-component').should('exist');
  });

  it('renders empty when no children provided', () => {
    cy.mount(<SampleComponent />);
    
    cy.get('.sample-component').should('exist');
    cy.get('.sample-component').should('contain', '');
  });

  it('applies the correct CSS class', () => {
    cy.mount(
      <SampleComponent>
        Test content
      </SampleComponent>
    );
    
    cy.get('.sample-component').should('have.class', 'sample-component');
  });
});
