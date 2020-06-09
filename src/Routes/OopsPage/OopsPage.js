import React from 'react';
import { withRouter } from 'react-router-dom';

import { Main, Unavailable } from '@redhat-cloud-services/frontend-components';

const OopsPage = () => {
    return (
        <Main>
            <Unavailable/>
        </Main>
    );
};

export default withRouter(OopsPage);
