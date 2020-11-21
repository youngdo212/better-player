/** @module utils/element */

/**
 * 태그와 속성(attribute)를 이용해서 엘리먼트를 생성한다.
 *
 * @example
 * const el = createElement('input', {type: 'text', autofocus: ''})
 * // <input type="text" autofocus>
 *
 * @param {string=} tagName
 * @param {object=} attributes
 * @returns {HTMLElement}
 */
export function createElement(tagName = 'div', attributes = {}) {
  const el = document.createElement(tagName);
  Object.keys(attributes).forEach(key => {
    const value = attributes[key];
    el.setAttribute(key, value);
  });
  return el;
}

/**
 * 엘리먼트를 DOM에서 제거한다
 * @param {HTMLElement} element
 */
export function removeElement(element) {
  const parent = element.parentNode;
  if (parent) {
    parent.removeChild(element);
  }
}

/**
 * 엘리먼트에 이벤트 리스너를 추가한다
 * @param {HTMLElement} element
 * @param {string} eventName
 * @param {EventListener} listener
 * @param {(object|boolean)=} options
 * @returns {HTMLElement}
 */
export function addEventListener(element, eventName, listener, options) {
  element.addEventListener(eventName, listener, options);
  return element;
}

/**
 * 엘리먼트에 등록된 이벤트 리스너를 제거한다
 * @param {HTMLElement} element
 * @param {string} eventName
 * @param {EventListener} listener
 * @param {(object|boolean)=} options
 * @returns {HTMLElement}
 */
export function removeEventListener(element, eventName, listener, options) {
  element.removeEventListener(eventName, listener, options);
  return element;
}

/**
 * 자식 엘리먼트를 마지막 위치에 추가한다
 * @param {HTMLElement} parent
 * @param {HTMLElement} child
 */
export function appendChild(parent, child) {
  parent.appendChild(child);
}
