import type { DefaultTheme, LocaleSpecificConfig } from "vitepress";

export function defineLoacaleConfig(config: LocaleSpecificConfig<DefaultTheme.Config> & {
  label: string;
  link?: string;
}): LocaleSpecificConfig<DefaultTheme.Config> & {
  label: string;
  link?: string;
} {
  return config;
}
