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

// VIDEO 이벤트 목록
/**
 * 비디오를 재생했을 때 발생하는 이벤트.
 * 이 이벤트의 발생은 비디오가 실제로 재생되고 있음을 보장하지 않는다.
 * 단지 play() 메소드 등으로 비디오를 재생시키려는 시도를 했을 때 발생한다.
 * 비디오 재생 중 여부를 확인하려면 `playing` 이벤트를 이용하자.
 *
 * @event VIDEO_PLAY
 * @param {Event} event
 */
Events.VIDEO_PLAY = 'video:play';

/**
 * 비디오를 일시 정지했을 때 발생하는 이벤트.
 *
 * @event VIDEO_PAUSE
 * @param {Event} event
 */
Events.VIDEO_PAUSE = 'video:pause';