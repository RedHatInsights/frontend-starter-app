import React from 'react';
import PropTypes from 'prop-types';

const createReactClass = require('create-react-class');

/**
 * This is a dumb component that only recieves properties from a smart component.
 * Dumb components are usually functions and not classes.
 *
 */

const Tabs = createReactClass({
    displayName: 'Tabs',
    getDefaultProps () {
        return {
            selected: 0
        };
    },
    getInitialState () {
        return {
            selected: this.props.selected
        };
    },
    handleClick (index, event) {
        event.preventDefault();
        this.setState({
            selected: index
        });
    },
    propTypes: {
        selected: PropTypes.number,
        children: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.element
        ]).isRequired
    },
    _renderContent () {
        return (
            <div className='tabs__content'>
                {this.props.children[this.state.selected]}
            </div>
        );
    },
    _renderTitles () {
        function labels (child, index) {
            let activeClass = (this.state.selected === index ? 'active' : '');
            return (
                <li key={index}>
                    <a href="#"
                        className={activeClass}
                        onClick={this.handleClick.bind(this, index)}>
                        {child.props.label}
                    </a>
                </li>
            );
        }
        return (
            <ul className="tabs__labels">
                {this.props.children.map(labels.bind(this))}
            </ul>
        );
    },
    render () {
        return (
            <div className='tabs'>
                {this._renderTitles()}
                {this._renderContent()}
            </div>
        );
    }
});

export default Tabs;

// export default props => {

//      return (
//         <ul className='pf-p-secondary-nav' activeKey={props.activeKey}> {props.children} </ul>
//     );
// }
