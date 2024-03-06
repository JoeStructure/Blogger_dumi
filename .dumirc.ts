import { defineConfig } from 'dumi';

const repo = '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'
export default defineConfig({
  base: `/${repo}/`,
  publicPath: `/${repo}/`,
  themeConfig: {
    name: 'LokfBlogger',
  },
});
