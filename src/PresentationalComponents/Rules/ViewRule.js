import React from 'react';
import PropTypes from 'prop-types';

const ViewRule = (props) => {
    return (
        <h1>Rule {props.match.params.id}</h1>
    );
};

ViewRule.displayName = 'view-rule';

ViewRule.propTypes = {
    match: PropTypes.object
};

export default ViewRule;
