import { defineConfig } from 'dumi';

const repo = 'BLOGGER'
export default defineConfig({
  base: `/${repo}/`,
  publicPath: `/${repo}/`,
  themeConfig: {
    name: 'LokfBlogger',
  },
});
