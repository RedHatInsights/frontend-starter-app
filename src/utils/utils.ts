import { To } from 'react-router-dom';

export const linkBasename = '/staging/starter';
export const mergeToBasename = (to: To, basename: string): To => {
  console.log({ basename, to });
  if (typeof to === 'string') {
    // replace possible "//" after basename
    return `${basename}/${to}`.replace(
      new RegExp(`^${basename}//`),
      `${basename}/`,
    );
  }

  return {
    ...to,
    pathname: `${basename}/${to.pathname}`.replace(
      new RegExp(`^${basename}//`),
      `${basename}/`,
    ),
  };
};
