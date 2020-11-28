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
   * @param {function} callback
   * @param {object|null=} context callback이 호출될 때 bind될 객체
   */
  on(eventName, callback, context = null) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push({
      callback,
      context,
    });
  }

  /**
   * 등록된 이벤트 리스너를 제거한다.
   * @param {string=} eventName
   * @param {function=} callback
   */
  off(eventName, callback) {
    if (!eventName) {
      this.listeners = {};
    } else if (!callback) {
      delete this.listeners[eventName];
    } else if (this.listeners[eventName]) {
      this.listeners[eventName] = this.listeners[eventName].filter(
        listener => listener.callback !== callback
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
    this.listeners[eventName].forEach(({ callback, context }) => {
      callback.call(context, ...args);
    });
  }

  /**
   * 한 번만 호출되는 이벤트 리스너를 등록한다
   * @param {string} eventName
   * @param {function} callback
   * @param {object|null=} context
   */
  once(eventName, callback, context = null) {
    const wrapper = (...args) => {
      callback.call(context, ...args);
      this.off(eventName, wrapper);
    };

    this.on(eventName, wrapper, context);
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

/**
 * 비디오 시간이 변경되었을 때 발생
 *
 * @event VIDEO_TIMEUPDATE
 * @param {Event} event
 */
Events.VIDEO_TIMEUPDATE = 'video:timeupdate';

/**
 * 비디오의 길이가 변경 되었을 때 발생.
 *
 * @event VIDEO_DURATIONCHANGE
 * @param {Event} event
 */
Events.VIDEO_DURATIONCHANGE = 'video:durationchange';

/**
 * 비디오의 볼륨이 변경 되었을 때 발생.
 *
 * @event VIDEO_VOLUMECHANGE
 * @param {Event} event
 */
Events.VIDEO_VOLUMECHANGE = 'video:volumechange';

// PLAYER 이벤트 목록
/**
 * 비디오 플레이어를 재생했을 때 발생하는 이벤트.
 * 이 이벤트는 play() 등으로 비디오 플레이의 재생을 시도했을 때 발생한다.
 * 따라서 이벤트가 발생해도 비디오가 실제로 재생 중이 아닐 수 있다.
 *
 * @event PLAYER_PLAY
 * @param {Event} event
 */
Events.PLAYER_PLAY = 'play';

/**
 * 비디오 플레이어를 일시 정지했을 때 발생하는 이벤트
 *
 * @event PLAYER_PAUSE
 * @param {Event} event
 */
Events.PLAYER_PAUSE = 'pause';
