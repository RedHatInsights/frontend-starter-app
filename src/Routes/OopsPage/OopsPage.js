import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import { Main, Unavailable } from '@redhat-cloud-services/frontend-components';

const OopsPage = () => {
    useEffect(() => {
        insights?.chrome?.appAction?.('oops-page');
    }, []);
    return (
        <Main>
            <Unavailable/>
        </Main>
    );
};

export default withRouter(OopsPage);
