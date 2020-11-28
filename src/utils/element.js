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
 * @returns {any}
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
 * @param {Element} child
 */
export function appendChild(parent, child) {
  parent.appendChild(child);
}

/**
 * 엘리먼트의 내부 html을 변경한다
 * @param {HTMLElement} element
 * @param {string} htmlTemplate
 */
export function innerHTML(element, htmlTemplate) {
  element.innerHTML = htmlTemplate;
}

/**
 * 비디오 타입이 현재 브라우저에 재생이 가능한지 확인한다.
 * @param {string} videoType MIME Type
 */
export function canPlayVideoType(videoType) {
  const video = document.createElement('video');

  return !!video.canPlayType(videoType);
}

/**
 * id 속성을 이용해서 엘리먼트를 찾는다.
 * @param {string} id
 * @returns {HTMLElement}
 */
export function getElementById(id) {
  return document.getElementById(id);
}

/**
 * class 이름에 매칭되는 가장 첫 번째 엘리먼트를 탐색한다.
 * @param {HTMLElement} element
 * @param {string} className
 * @returns {any}
 */
export function getElementByClassName(element, className) {
  return element.querySelector(`.${className}`);
}

/**
 * 엘리먼트에 class를 추가한다. 중복 추가는 하지 않는다.
 *
 * @param {HTMLElement} element
 * @param {string} className
 */
export function addClass(element, className) {
  element.classList.add(className);
}

/**
 * 엘리먼트에서 class를 제거한다.
 *
 * @param {HTMLElement} element
 * @param {string} className
 */
export function removeClass(element, className) {
  element.classList.remove(className);
}
