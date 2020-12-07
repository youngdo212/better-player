/** @module base/ui-object */

import {
  addEventListener,
  createElement,
  removeElement,
  removeEventListener,
} from '../../utils/element';
import Events from '../events';

/**
 * UI를 가지는 객체의 base 클래스
 * @extends Events
 */
export default class UIObject extends Events {
  /**
   * UI에 대응되는 DOM 엘리먼트
   * @property el
   * @type {HTMLElement}
   */

  /**
   * 생성되는 엘리먼트(el)의 태그 이름
   * @returns {string}
   */
  get tagName() {
    return 'div';
  }

  /**
   * 생성되는 엘리먼트(el)가 가지는 속성
   *
   * @example
   * class Sample extends UIObject {
   *   get tagName() { return 'input' }
   *   get attributes() {
   *     return { type: 'text', disabled: '' };
   *   }
   * }
   * // 생성되는 엘리먼트는 <input type="text" disabled> 이런 형태일 것이다
   *
   * @returns {object}
   */
  get attributes() {
    return {};
  }

  /**
   * 생성되는 엘리먼트(el)에 추가될 이벤트 핸들러 맵핑 객체
   *
   * @example
   * class Sample extends UIObject {
   *   get events() {
   *     return { click: 'onClick' }
   *   }
   *   onClick() {}
   * }
   * // 엘리먼트의 click 이벤트에 onClick 메소드가 이벤트 핸들러로 추가됨
   *
   * @returns {object}
   */
  get events() {
    return {};
  }

  /**
   * UI에 대응되는 DOM 엘리먼트를 생성하고 이벤트 핸들러를 추가한다.
   */
  constructor() {
    super();
    this.el = createElement(this.tagName, this.attributes);
    this._events = this.normalizeEvents(this.events);
    this.delegateEvents();
  }

  // TODO: 리팩토링
  /**
   * 엘리먼트(el)에 실제로 등록할 함수로 구성된 이벤트 핸들러 매핑 객체를 생성한다
   * @param {object} events
   * @returns {object}
   */
  normalizeEvents(events) {
    return Object.entries(events).reduce((events, [event, listenerName]) => {
      const listener = this[listenerName];

      if (listener) {
        const [, selector] = event.split(' ');

        if (selector) {
          const wrapper = e => {
            if (!this.el.querySelector(selector).contains(e.target)) return;

            listener.call(this, e);
          };

          return { ...events, [event]: wrapper };
        } else {
          return { ...events, [event]: listener.bind(this) };
        }
      } else {
        return events;
      }
    }, {});
  }

  /**
   * 엘리먼트(el)에 이벤트 핸들러를 등록한다
   */
  delegateEvents() {
    Object.entries(this._events).forEach(([event, listener]) => {
      const [eventName] = event.split(' ');
      addEventListener(this.el, eventName, listener);
    });
  }

  /**
   * 엘리먼트(el)에서 UIObject가 등록한 이벤트 핸들러들을 제거한다
   */
  undelegateEvents() {
    Object.entries(this._events).forEach(([event, listener]) => {
      const [eventName] = event.split(' ');
      removeEventListener(this.el, eventName, listener);
    });
  }

  /**
   * 자식 엘리먼트를 생성하고 실제 DOM에 엘리먼트(el)을 추가한다
   * @returns {UIObject}
   */
  render() {
    return this;
  }

  /**
   * 엘리먼트(el)에 등록된 모든 이벤트 핸들러를 제거하고
   * DOM에서 엘리먼트(el)를 삭제한다
   * @returns {UIObject}
   */
  destroy() {
    this.undelegateEvents();
    removeElement(this.el);
    this.off();
    this.stopListening();
    return this;
  }
}
