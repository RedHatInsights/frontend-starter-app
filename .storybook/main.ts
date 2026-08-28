import { createMainConfig } from '@redhat-cloud-services/hcc-storybook-hub/config';
import remarkGfm from 'remark-gfm';

export default createMainConfig({
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  staticDirs: ['../static'],
  remarkPlugins: [remarkGfm],
});
