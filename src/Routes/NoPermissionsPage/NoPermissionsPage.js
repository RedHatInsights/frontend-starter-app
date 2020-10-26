import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import { Main, NotAuthorized } from '@redhat-cloud-services/frontend-components';

const NoPermissionsPage = () => {
    useEffect(() => {
        insights?.chrome?.appAction?.('no-permissions');
    }, []);

    return (
        <Main>
            <NotAuthorized serviceName='Sample app'/>
        </Main>
    );
};

export default withRouter(NoPermissionsPage);
