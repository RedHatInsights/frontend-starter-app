// eslint-disable-next-line no-restricted-imports -- AppLink is the wrapper for Link
import { Link, type LinkProps } from 'react-router-dom';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { mergeToBasename } from '../utils/mergeToBasename';

export const AppLink = (props: LinkProps) => {
  const { getBundle, getApp } = useChrome();
  const basename = `/${getBundle()}/${getApp()}`;
  return <Link {...props} to={mergeToBasename(props.to, basename)} />;
};
