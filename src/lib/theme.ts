/** Theme settings shared by the inline no-flash script and the theme toggle (wiki: Theme). */

export type Theme = 'dark' | 'light';

export const defaultTheme: Theme = 'dark';

/** localStorage key, taken from the design. */
export const themeStorageKey = 'mn-theme';

/** Browser UI colour per theme. Must match --paper in src/styles/tokens.css. */
export const themeColors = {
  dark: '#111110',
  light: '#f5f4f1',
} as const satisfies Record<Theme, string>;
