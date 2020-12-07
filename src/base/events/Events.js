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
    this.listeningTo = []; // listenTo 메소드를 이용해 이벤트 리스너를 추가한 대상
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
   * @param {object=} context
   */
  off(eventName, callback, context) {
    const eventNames = eventName ? [eventName] : Object.keys(this.listeners);

    eventNames.forEach(e => {
      let listeners = this.listeners[e];

      if (!listeners) return;

      // 제거할 리스너를 제외시킨 배열을 만든다
      listeners = listeners.filter(listener => {
        const cb = listener.callback;
        const ctx = listener.context;
        const hasTargetCallback = !callback || cb === callback;
        const hasTargetContext = !context || ctx === context;

        return !hasTargetCallback || !hasTargetContext;
      });

      this.listeners[e] = listeners;

      if (!listeners.length) delete this.listeners[e];
    });
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

  /**
   * 해당 events 객체에 이벤트 리스너를 등록한다.
   * on과 유사하지만, listenTo를 이용하면 리스닝하고 있는 events 객체를
   * 속성으로 참조할 수 있다.
   *
   * @param {Events} events
   * @param {string} eventName
   * @param {function} callback
   */
  listenTo(events, eventName, callback) {
    const isListeningTo = this.listeningTo.find(item => item === events);

    if (!isListeningTo) this.listeningTo.push(events);

    events.on(eventName, callback, this);
  }

  /**
   * 대상 events 객체에 등록한 이벤트 리스너를 전부 제거한다
   *
   * @param {Events=} events
   */
  stopListening(events) {
    const targets = events ? [events] : this.listeningTo;

    targets.forEach(target => {
      target.off(undefined, undefined, this);
    });

    this.listeningTo = events
      ? this.listeningTo.filter(item => item !== events)
      : [];
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

/**
 * 비디오가 끝났을 때 발생하는 이벤트
 *
 * @event VIDEO_ENDED
 * @param {Event} event
 */
Events.VIDEO_ENDED = 'video:ended';

/**
 * 비디오 탐색을 시작했을 때 발생하는 이벤트
 *
 * @event VIDEO_SEEKING
 * @param {Event} event
 */
Events.VIDEO_SEEKING = 'video:seeking';

/**
 * 비디오 탐색을 끝마쳤을 때 발생하는 이벤트
 *
 * @event VIDEO_SEEKED
 * @param {Event} event
 */
Events.VIDEO_SEEKED = 'video:seeked';

/**
 * 비디오에 에러가 발생했을 때 발생하는 이벤트
 *
 * @event VIDEO_ERROR
 * @param {Event} event
 */
Events.VIDEO_ERROR = 'video:error';

/**
 * 비디오 플레이어의 전체 화면 여부가 변경되었을 때 발생.
 *
 * @event CORE_FULLSCREENCHANGE
 * @param {Event} event
 */
Events.CORE_FULLSCREENCHANGE = 'core:fullsceenchange';

/**
 * 페이지의 전체 화면 여부가 변경되었을 때 발생.
 *
 * @event FULLSCREEN_CHANGE
 * @param {Event} event
 */
Events.FULLSCREEN_CHANGE = 'fullscreen:change';

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

/**
 * 비디오의 볼륨이 변경되었을 때 발생하는 이벤트
 *
 * @event PLAYER_VOLUMECHANGE
 * @param {Event} event
 */
Events.PLAYER_VOLUMECHANGE = 'volumechange';

/**
 * 비디오 플레이어의 현재 시간이 변경될 때마다 발생하는 이벤트
 *
 * @event PLAYER_TIMEUPDATE
 * @param {Event} event
 */
Events.PLAYER_TIMEUPDATE = 'timeupdate';

/**
 * 비디오 플레이어가 끝이났을 때 발생하는 이벤트
 *
 * @event PLAYER_ENDED
 * @param {Event} event
 */
Events.PLAYER_ENDED = 'ended';

/**
 * 비디오 플레이어 탐색을 시작했을 때 발생하는 이벤트
 *
 * @event PLAYER_SEEKING
 * @param {Event} event
 */
Events.PLAYER_SEEKING = 'seeking';

/**
 * 비디오 플레이어 탐색을 끝마쳤을 때 발생하는 이벤트
 *
 * @event PLAYER_SEEKED
 * @param {Event} event
 */
Events.PLAYER_SEEKED = 'seeked';

/**
 * 비디오 플레이어가 전체화면이 되었을 때 발생하는 이벤트
 *
 * @event PLAYER_REQUESTFULLSCREEN
 * @param {Event} event
 */
Events.PLAYER_REQUESTFULLSCREEN = 'requestfullscreen';

/**
 * 비디오 플레이어의 전체화면이 해제되었을 때 발생하는 이벤트
 *
 * @event PLAYER_EXITFULLSCREEN
 * @param {Event} event
 */
Events.PLAYER_EXITFULLSCREEN = 'exitfullscreen';
