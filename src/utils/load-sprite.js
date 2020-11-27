/** @module utils/load-sprite */

import { getElementByClassName } from './element';
import request from './request';

/**
 * svg sprite를 DOM에 삽입한다.
 *
 * @param {string} url
 */
export default function loadSprite(url) {
  const body = document.body;
  const spriteEl = getElementByClassName(
    body,
    'better-player__svg-sprite-wrapper'
  );

  if (!spriteEl) {
    request({ url }).then(response => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = response;
      wrapper.style.display = 'none';
      wrapper.setAttribute('hidden', '');
      wrapper.className = 'better-player__svg-sprite-wrapper';
      body.insertAdjacentElement('afterbegin', wrapper);
    });
  }
}
