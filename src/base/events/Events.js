/** @module base/events */

/**
 * 이벤트 및 이벤트 리스너를 관리하는 클래스
 */
export default class Events {
  /**
   * 인스턴스를 생성한다
   */
  constructor() {
    this.listeners = {};
  }

  /**
   * 이벤트 리스너를 등록한다.
   * @param {string} eventName
   * @param {function} listener
   */
  on(eventName, listener) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(listener);
  }

  /**
   * 등록된 이벤트 리스너를 제거한다.
   * @param {string=} eventName
   * @param {function=} listener
   */
  off(eventName, listener) {
    if (!eventName) {
      this.listeners = {};
    } else if (!listener) {
      delete this.listeners[eventName];
    } else if (this.listeners[eventName]) {
      this.listeners[eventName] = this.listeners[eventName].filter(
        item => item !== listener
      );

      this.listeners[eventName].length || delete this.listeners[eventName];
    }
  }

  /**
   * 이벤트를 발생시켜 등록된 이벤트 리스너를 인자와 함께 호출한다.
   * @param {string} eventName
   * @param  {...any} args
   */
  emit(eventName, ...args) {
    if (!this.listeners[eventName]) return;
    this.listeners[eventName].forEach(listener => {
      listener(...args);
    });
  }

  /**
   * 한 번만 호출되는 이벤트 리스너를 등록한다
   * @param {string} eventName
   * @param {function} listener
   */
  once(eventName, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.off(eventName, wrapper);
    };

    this.on(eventName, wrapper);
  }
}
