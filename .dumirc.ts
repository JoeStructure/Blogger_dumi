import { defineConfig } from 'dumi';

const repo = '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'
export default defineConfig({
  base: `/${repo}/`,
  publicPath: `/${repo}/`,
  themeConfig: {
    name: 'LokfBlogger',
  },
});
