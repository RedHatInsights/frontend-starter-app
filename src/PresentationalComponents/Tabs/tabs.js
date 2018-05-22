import React from 'react';
import PropTypes from 'prop-types';

const createReactClass = require('create-react-class');

/**
 * Component that accepts a list of Tabs from the children prop and a selected prop
 * which specifies which tab that should be selected by default 
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
            <div className='tabs_content'>
                {this.props.children[this.state.selected]}
            </div>
        );
    },
    _renderTitles () {
        function labels (child, index) {
            return (
                <li className='pf-p-secondary-nav__item' key={index}>
                    <a href='#'
                        className={"pf-p-secondary-nav__link " + (this.state.selected === index ? 'pf-is-active' : '')}
                        onClick={this.handleClick.bind(this, index)}
                        role='tab'>
                        {child.props.label}
                    </a>
                </li>
            );
        }
        return (
            <ul className='pf-p-secondary-nav' role='tablist'>
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
