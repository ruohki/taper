import { createGlobalStyle } from 'styled-components'

import "typeface-roboto";

export const COLOR_DARKEST = "#23272A";
export const COLOR_DARKER = "#2C2F33";
export const COLOR_DARK = "#42464C";
export const COLOR_GRAY = "#99AAB5";
export const COLOR_LABEL = "#ECECEC";
export const COLOR_BLUE = "#7289DA";

export const COLOR_BACKGROUND = "#E5E5E5";

export const COLOR_ERROR = "#EC4343";
export const COLOR_WARNING = "#C0EC43";
export const COLOR_SUCCESS = "#76D976";

export const COLOR_BLACK = "#000000";
export const COLOR_WHITE = "#FFFFFF";

export const Global = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;

    transition: color 0.25s ease;
  }

  body {
    font-family: "Roboto";
    color: ${COLOR_WHITE};
    background-color: ${COLOR_BACKGROUND};

    height: 100vh;
    max-height: 100vh;
    overflow: hidden;
  }


`;