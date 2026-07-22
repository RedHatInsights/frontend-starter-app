import { screen, userEvent, waitFor, within } from 'storybook/test';

const TEST_TIMEOUTS = {
  ELEMENT_WAIT: 10000,
  POST_MUTATION_REFRESH: 20000,
  NOTIFICATION_WAIT: 5000,
  QUICK_SETTLE: 100,
  AFTER_CLICK: 300,
};

export async function waitForContentReady(
  canvasElement: HTMLElement,
): Promise<void> {
  await waitFor(
    () => {
      const skeletons = canvasElement.querySelectorAll('.pf-v6-c-skeleton');
      if (skeletons.length > 0) throw new Error('Still loading (skeletons)');
      const spinners = canvasElement.querySelectorAll('.pf-v6-c-spinner');
      if (spinners.length > 0) throw new Error('Still loading (spinner)');
    },
    { timeout: TEST_TIMEOUTS.ELEMENT_WAIT },
  );
  await new Promise((r) => setTimeout(r, TEST_TIMEOUTS.QUICK_SETTLE));
}

export async function waitForModal(): Promise<ReturnType<typeof within>> {
  const dialog = await screen.findByRole(
    'dialog',
    {},
    { timeout: TEST_TIMEOUTS.ELEMENT_WAIT },
  );
  return within(dialog);
}

export async function waitForModalClose(): Promise<void> {
  await waitFor(
    () => {
      const dialogs = document.querySelectorAll('[role="dialog"]');
      if (dialogs.length > 0) throw new Error('Modal still open');
    },
    { timeout: TEST_TIMEOUTS.ELEMENT_WAIT },
  );
}

export async function clearAndType(
  user: {
    clear: (el: Element) => Promise<void>;
    type: (el: Element, text: string) => Promise<void>;
  },
  getElement: () => HTMLElement,
  text: string,
): Promise<void> {
  const el = getElement();
  await user.clear(el);
  await user.type(el, text);
}

export async function waitForNotification(
  text: string | RegExp,
): Promise<void> {
  await waitFor(
    () => {
      const alerts = document.querySelectorAll('.pf-v6-c-alert');
      const found = Array.from(alerts).some((alert) =>
        typeof text === 'string'
          ? alert.textContent?.includes(text)
          : text.test(alert.textContent || ''),
      );
      if (!found) throw new Error(`Notification "${text}" not found`);
    },
    { timeout: TEST_TIMEOUTS.NOTIFICATION_WAIT },
  );
}

export async function confirmDestructiveModal(
  actionText = 'Delete',
): Promise<void> {
  const user = userEvent.setup();
  const modal = await waitForModal();
  const button = await modal.findByRole('button', { name: actionText });
  await user.click(button);
  await waitForModalClose();
}

export { TEST_TIMEOUTS };
