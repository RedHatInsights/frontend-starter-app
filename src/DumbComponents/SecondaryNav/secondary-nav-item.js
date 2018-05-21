import React from 'react';

/**
 * This is a dumb component that only recieves properties from a smart component.
 * Dumb components are usually functions and not classes.
 *
 */

export default props => {

  // TODO, assign the pf-is-active class to the selected item

     return (
        <li className='pf-p-secondary-nav__item'>
            <a className='pf-p-secondary-nav__link' role='tab'> {props.children} </a>
        </li>
    );
}
