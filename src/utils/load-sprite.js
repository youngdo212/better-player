/** @module utils/load-sprite */

/**
 * svg sprite를 DOM에 삽입한다.
 *
 * @param {string} url
 */
export default function loadSprite(url) {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    const body = document.body;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = xhr.responseText;
    wrapper.style.display = 'none';
    wrapper.setAttribute('hidden', '');
    body.insertAdjacentElement('afterbegin', wrapper);
  };
  xhr.open('get', url);
  xhr.send();
}
