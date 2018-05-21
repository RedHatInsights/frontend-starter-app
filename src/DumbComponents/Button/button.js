import React from 'react';

import classNames from 'classnames';

/**
 * This is a dumb component that only recieves properties from a smart component.
 * Dumb components are usually functions and not classes.
 *
 * Button Modifiers:
 *  Types = 'primary', 'secondary', 'tertiary' (default), 'danger'
 *  Sizes = 'small', 'large' NOTE: Default is medium, no modifier needed
 *  States = 'focused', 'active', 'disabled'
 */

export default props => {

    let btnClasses = classNames(
      'pf-c-button',
      [`pf-is-${props.type}`],
      [`pf-is-${props.size}`],
      {
        'pf-has-focus': props.state === 'focused',
        [`pf-is-${props.state}`]: props.state && props.state !== 'focused'
      }
    );

     return (
        <button className={btnClasses}> {props.children} </button>
    );
}
