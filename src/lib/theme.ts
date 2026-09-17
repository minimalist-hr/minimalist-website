/** Theme settings shared by the inline no-flash script and the theme toggle (plan §6). */

export const themes = ['dark', 'light'] as const;

export type Theme = (typeof themes)[number];

export const defaultTheme: Theme = 'dark';

/** localStorage key, taken from the design. */
export const themeStorageKey = 'mn-theme';

/** Browser UI colour per theme. Must match --paper in src/styles/tokens.css. */
export const themeColors = {
  dark: '#111110',
  light: '#f5f4f1',
} as const satisfies Record<Theme, string>;
