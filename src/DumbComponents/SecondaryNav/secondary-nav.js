import React from 'react';

/**
 * This is a dumb component that only recieves properties from a smart component.
 * Dumb components are usually functions and not classes.
 *
 */

export default props => {

     return (
        <ul className='pf-p-secondary-nav' role='tablist'> {props.children} </ul>
    );
}
