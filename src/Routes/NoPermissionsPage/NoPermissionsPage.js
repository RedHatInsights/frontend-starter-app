import React from 'react';
import { withRouter } from 'react-router-dom';

import { Main, NotAuthorized } from '@redhat-cloud-services/frontend-components';

const NoPermissionsPage = () => {
    return (
        <Main>
            <NotAuthorized serviceName='Sample app'/>
        </Main>
    );
};

export default withRouter(NoPermissionsPage);
