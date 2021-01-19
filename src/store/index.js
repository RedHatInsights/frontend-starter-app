import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/files/Registry';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';

let registry;

export function init (...middleware) {
    registry = getRegistry({}, [
        promiseMiddleware,
        notificationsMiddleware({ errorDescriptionKey: ['detail', 'stack'] }),
        ...middleware
    ]);
    return registry;
}

export function getStore () {
    return registry.getStore();
}

export function register (...args) {
    return registry.register(...args);
}
