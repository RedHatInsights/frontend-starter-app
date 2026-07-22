import { To } from 'react-router-dom';

export const mergeToBasename = (to: To, basename: string): To => {
  if (!basename) return to;
  if (typeof to === 'string') {
    if (to.startsWith(basename)) return to;
    return `${basename}/${to}`.replaceAll('//', '/');
  }
  if (to.pathname?.startsWith(basename)) return to;
  return {
    ...to,
    pathname: `${basename}/${to.pathname}`.replaceAll('//', '/'),
  };
};
