/** @module base/ui-object */

import type { Attributes, MethodNames } from '../../types';
import {
  addEventListener,
  createElement,
  removeElement,
  removeEventListener,
  querySelector,
} from '../../utils/element';
import Events from '../events';

// TODO: value에 해당되는 메소드의 이름의 타입을 string보다 더 strict하게 만들기
/**
 * key(이벤트 이름과 셀렉터의 조합): value(메소드의 이름) 형태의 객체
 *
 * @example
 * {'click': 'onClick'}
 * {'click .some-class': 'someMethodName'}
 */
interface EventHandlerNameMap {
  [eventNameWithSelector: string]: string;
}

/**
 * key(이벤트 이름과 셀렉터의 조합): value(함수) 형태의 객체
 */
interface EventHandlerMap {
  [eventNameWithSelector: string]: (e: Event) => void;
}

/**
 * UI를 가지는 객체의 base 클래스
 * @extends Events
 */
export default abstract class UIObject extends Events {
  /**
   * UI에 대응되는 DOM 엘리먼트
   */
  public readonly el: HTMLElement;

  /**
   * 실제로 el에 등록할 함수가 이벤트 이름에 매핑되어 있는 객체
   */
  private _events: EventHandlerMap;

  /**
   * 생성되는 엘리먼트(el)의 태그 이름
   */
  get tagName(): string {
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
   */
  get attributes(): Attributes {
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
   */
  get events(): EventHandlerNameMap {
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
   */
  normalizeEvents(events: EventHandlerNameMap): EventHandlerMap {
    return Object.entries(events).reduce((events, [event, listenerName]) => {
      assertIsMethodName(this, listenerName);

      const listener = this[listenerName];

      if (typeof listener === 'function') {
        const [, selector] = event.split(' ');

        if (selector) {
          const wrapper = (e: Event) => {
            if (e.target instanceof Node) {
              if (!querySelector(this.el, selector)?.contains(e.target)) return;
              listener.call(this, e);
            }
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
  delegateEvents(): void {
    Object.entries(this._events).forEach(([event, listener]) => {
      const [eventName] = event.split(' ');
      addEventListener(this.el, eventName, listener);
    });
  }

  /**
   * 엘리먼트(el)에서 UIObject가 등록한 이벤트 핸들러들을 제거한다
   */
  undelegateEvents(): void {
    Object.entries(this._events).forEach(([event, listener]) => {
      const [eventName] = event.split(' ');
      removeEventListener(this.el, eventName, listener);
    });
  }

  /**
   * 자식 엘리먼트를 생성하고 실제 DOM에 엘리먼트(el)을 추가한다
   */
  render(): UIObject {
    return this;
  }

  /**
   * 엘리먼트(el)에 등록된 모든 이벤트 핸들러를 제거하고
   * DOM에서 엘리먼트(el)를 삭제한다
   */
  destroy(): UIObject {
    this.undelegateEvents();
    removeElement(this.el);
    this.off();
    this.stopListening();
    return this;
  }
}

/**
 * 해당되는 메소드 이름을 가지도록 단언한다.
 */
function assertIsMethodName<T>(
  obj: T,
  propName: string,
): asserts propName is MethodNames<T> {
  if (typeof (obj as { [key: string]: any })[propName] !== 'function') {
    throw Error('invalid method name');
  }
}
