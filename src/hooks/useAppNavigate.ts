// eslint-disable-next-line no-restricted-imports -- useAppNavigate is the wrapper for useNavigate
import { type NavigateOptions, type To, useNavigate } from 'react-router-dom';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { mergeToBasename } from '../utils/mergeToBasename';

type AppNavigate = (to: To, options?: NavigateOptions) => void;

export const useAppNavigate = (): AppNavigate => {
  const navigate = useNavigate();
  const { getBundle, getApp } = useChrome();
  const basename = `/${getBundle()}/${getApp()}`;

  return (to: To, options?: NavigateOptions) => {
    return navigate(mergeToBasename(to, basename), options);
  };
};
