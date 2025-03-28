/**
 * set URL in address bar, theme-color and title
 */

import {
  durationToString,
} from '../../core/utils';

/*
 * set theme-color meta tag that sets the color
 * of address bars on phones
 */
function setThemeColorMeta(r, g, b) {
  const metaThemeColor = document.querySelector('meta[name=theme-color]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', `rgb(${r}, ${g}, ${b})`);
  }
}

const TITLE = 'PixUniverse.fun';

let lastTitle = null;

export default (store) => (next) => (action) => {
  const ret = next(action);

  switch (action.type) {
    case 'COOLDOWN_SET': {
      const { coolDown } = store.getState().user;
      const title = `${durationToString(coolDown, true)} | ${TITLE}`;
      if (lastTitle === title) break;
      lastTitle = title;
      document.title = title;
      break;
    }

    case 'COOLDOWN_END': {
      document.title = TITLE;
      break;
    }

    case 's/SELECT_CANVAS':
    case 's/REC_ME':
    case 'RELOAD_URL':
    case 'UPDATE_VIEW': {
      const state = store.getState();

      const {
        view,
        canvasIdent,
        is3D,
      } = state.canvas;

      if (action.type !== 'UPDATE_VIEW') {
        const [r, g, b] = state.canvas.palette.rgb;
        setThemeColorMeta(r, g, b);
      }

      const viewString = view.map((c, ind) => {
        if (ind === 2 && !is3D) {
          c = Math.log2(c) * 10;
        }
        return Math.round(c);
      }).join(',');
      const newhash = `#${canvasIdent},${viewString}`;
      window.history.replaceState(undefined, undefined, newhash);
      break;
    }

    default:
    // nothing
  }

  return ret;
};
