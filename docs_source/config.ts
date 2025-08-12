import { type LocaleConfig, type DefaultTheme } from 'vitepress'
import zhConfig from './zh/config';
import enConfig from './en/config';

export const locales: LocaleConfig<DefaultTheme.Config> = {
  root: enConfig,
  zh: zhConfig,
};
