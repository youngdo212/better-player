/** @module utils/element */

interface Attributes {
  [key: string]: string;
}

interface SelectorMap {
  [key: string]: string;
}

interface HTMLElementMap {
  [key: string]: HTMLElement | null;
}

/**
 * 태그와 속성(attribute)를 이용해서 엘리먼트를 생성한다.
 *
 * @example
 * const el = createElement('input', {type: 'text', autofocus: ''})
 * // returns <input type="text" autofocus>
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName?: K,
  attributes?: Attributes,
): HTMLElementTagNameMap[K];
export function createElement(
  tagName = 'div',
  attributes: Attributes = {},
): HTMLElement {
  const el = document.createElement(tagName);
  Object.keys(attributes).forEach(key => {
    const value = attributes[key];
    el.setAttribute(key, value);
  });
  return el;
}

/**
 * 엘리먼트를 DOM에서 제거한다
 */
export function removeElement(element: HTMLElement): void {
  const parent = element.parentNode;
  if (parent) {
    parent.removeChild(element);
  }
}

/**
 * 엘리먼트에 이벤트 리스너를 추가한다
 */
export function addEventListener<
  T extends HTMLElement,
  K extends keyof HTMLElementEventMap
>(
  element: T,
  eventName: K,
  listener: (e: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions,
): T {
  element.addEventListener(eventName, listener, options);
  return element;
}

/**
 * 엘리먼트에 등록된 이벤트 리스너를 제거한다
 */
export function removeEventListener<
  T extends HTMLElement,
  K extends keyof HTMLElementEventMap
>(
  element: T,
  eventName: K,
  listener: (e: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions,
): T {
  element.removeEventListener(eventName, listener, options);
  return element;
}

/**
 * 자식 엘리먼트를 마지막 위치에 추가한다
 */
export function appendChild(parent: HTMLElement, child: HTMLElement): void {
  parent.appendChild(child);
}

/**
 * 엘리먼트의 내부 html을 변경한다
 */
export function innerHTML(element: HTMLElement, htmlTemplate: string): void {
  element.innerHTML = htmlTemplate;
}

/**
 * 비디오 타입이 현재 브라우저에 재생이 가능한지 확인한다.
 * @param {string} videoType MIME Type
 */
export function canPlayVideoType(videoType: string): boolean {
  const video = document.createElement('video');

  return !!video.canPlayType(videoType);
}

/**
 * id 속성을 이용해서 엘리먼트를 찾는다.
 */
export function getElementById(id: string): HTMLElement | null {
  return document.getElementById(id);
}

/**
 * class 이름에 매칭되는 가장 첫 번째 엘리먼트를 탐색한다.
 */
export function getElementByClassName(
  element: HTMLElement,
  className: string,
): HTMLElement | null {
  return element.querySelector(`.${className}`);
}

/**
 * 엘리먼트에 class를 추가한다. 중복 추가는 하지 않는다.
 */
export function addClass(element: HTMLElement, className: string): void {
  element.classList.add(className);
}

/**
 * 엘리먼트에서 class를 제거한다.
 */
export function removeClass(element: HTMLElement, className: string): void {
  element.classList.remove(className);
}

/**
 * DOM에서 제거하지 않고 엘리먼트를 숨긴다.
 * 숨겨진 엘리먼트는 공간을 차지하지 않는다.
 */
export function hideElement(element: HTMLElement): void {
  element.style.display = 'none';
}

/**
 * hideElement()를 통해 숨겨진 엘리먼트를 다시 등장시킨다.
 */
export function showElement(element: HTMLElement): void {
  element.style.display = '';
}

/**
 * selector를 이용해 엘리먼트를 찾아 반환한다.
 */
export function querySelector(
  parent: HTMLElement,
  selector: string,
): HTMLElement | null {
  return parent.querySelector(selector);
}

/**
 * selector 맵핑 객체를 이용해 엘리먼트를 찾는다.
 *
 * @example
 * getElementsBySelectorMap(parent, {myButton: '.my-button'})
 * // returns {myButton: HTMLElement};
 */
export function getElementsBySelectorMap(
  parent: HTMLElement,
  selectorMap: SelectorMap,
): HTMLElementMap {
  const elements: HTMLElementMap = {};

  Object.keys(selectorMap).forEach(elementName => {
    elements[elementName] = querySelector(parent, selectorMap[elementName]);
  });

  return elements;
}
