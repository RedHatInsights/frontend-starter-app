import { atom, useSetAtom } from 'jotai';
import { NotificationProps } from '@redhat-cloud-services/frontend-components-notifications/Notification';
import { AddNotificationPayload } from '@redhat-cloud-services/frontend-components-notifications/redux/actions/notifications';

export const notificationsAtom = atom<NotificationProps[]>([]);
export const removeNotification = atom(
  null,
  (_get, set, id: NotificationProps['id']) => {
    set(notificationsAtom, (notifications) =>
      notifications.filter((notification) => notification.id !== id)
    );
  }
);
export const addNotification = atom(
  null,
  (_get, set, notification: AddNotificationPayload) => {
    const id = crypto.randomUUID();
    const onDismiss = () => set(removeNotification, id);
    set(notificationsAtom, (notifications) => [
      ...notifications,
      { id, onDismiss, ...notification },
    ]);
    return id;
  }
);
export const clearNotifications = atom(null, (_get, set) => {
  set(notificationsAtom, []);
});

export const useAddNotification = () => {
  const set = useSetAtom(addNotification);
  return set;
};

export const useRemoveNotification = () => {
  const set = useSetAtom(removeNotification);
  return set;
};

export const useClearNotifications = () => {
  const set = useSetAtom(clearNotifications);
  return set;
};
