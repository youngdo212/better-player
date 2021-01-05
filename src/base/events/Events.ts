/** @module base/events */

type ListenerCallback = (...args: any[]) => void;

type ListenerContext = Events | null; // ListenerCallback이 호출될 때 this로 사용될 객체

interface Listener {
  callback: ListenerCallback;
  context: ListenerContext;
}

interface ListenerMap {
  [eventName: string]: Listener[];
}

/**
 * 이벤트 및 이벤트 리스너를 관리하는 클래스
 */
export default abstract class Events {
  private listeners: ListenerMap = {};
  private listeningTo: Events[] = [];

  /**
   * 이벤트 리스너를 등록한다.
   */
  on(
    eventName: string,
    callback: ListenerCallback,
    context: ListenerContext = null,
  ): void {
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
   */
  off(
    eventName?: string,
    callback?: ListenerCallback,
    context?: ListenerContext,
  ): void {
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
   */
  emit(eventName: string, ...args: any[]): void {
    if (!this.listeners[eventName]) return;
    this.listeners[eventName].forEach(({ callback, context }) => {
      callback.call(context, ...args);
    });
  }

  /**
   * 한 번만 호출되는 이벤트 리스너를 등록한다
   */
  once(
    eventName: string,
    callback: ListenerCallback,
    context: ListenerContext = null,
  ): void {
    const wrapper = (...args: any[]) => {
      callback.call(context, ...args);
      this.off(eventName, wrapper);
    };

    this.on(eventName, wrapper, context);
  }

  /**
   * 해당 events 객체에 이벤트 리스너를 등록한다.
   * on과 유사하지만, listenTo를 이용하면 리스닝하고 있는 events 객체를
   * 속성으로 참조할 수 있다.
   */
  listenTo(
    events: Events,
    eventName: string,
    callback: ListenerCallback,
  ): void {
    const isListeningTo = this.listeningTo.find(item => item === events);

    if (!isListeningTo) this.listeningTo.push(events);

    events.on(eventName, callback, this);
  }

  /**
   * 대상 events 객체에 등록한 이벤트 리스너를 전부 제거한다
   */
  stopListening(events?: Events): void {
    const targets = events ? [events] : this.listeningTo;

    targets.forEach(target => {
      target.off(undefined, undefined, this);
    });

    this.listeningTo = events
      ? this.listeningTo.filter(item => item !== events)
      : [];
  }

  /***********************
   *
   * 비디오 플레이어 이벤트 목록
   *
   ***********************/

  /**
   * 비디오를 재생했을 때 발생하는 이벤트.
   * 이 이벤트의 발생은 비디오가 실제로 재생되고 있음을 보장하지 않는다.
   * 단지 play() 메소드 등으로 비디오를 재생시키려는 시도를 했을 때 발생한다.
   * 비디오 재생 중 여부를 확인하려면 `playing` 이벤트를 이용하자.
   */
  static VIDEO_PLAY = 'video:play';

  /**
   * 비디오를 일시 정지했을 때 발생하는 이벤트.
   */
  static VIDEO_PAUSE = 'video:pause';

  /**
   * 비디오 시간이 변경되었을 때 발생
   */
  static VIDEO_TIMEUPDATE = 'video:timeupdate';

  /**
   * 비디오의 길이가 변경 되었을 때 발생.
   */
  static VIDEO_DURATIONCHANGE = 'video:durationchange';

  /**
   * 비디오의 볼륨이 변경 되었을 때 발생.
   */
  static VIDEO_VOLUMECHANGE = 'video:volumechange';

  /**
   * 비디오가 끝났을 때 발생하는 이벤트
   */
  static VIDEO_ENDED = 'video:ended';

  /**
   * 비디오 탐색을 시작했을 때 발생하는 이벤트
   */
  static VIDEO_SEEKING = 'video:seeking';

  /**
   * 비디오 탐색을 끝마쳤을 때 발생하는 이벤트
   */
  static VIDEO_SEEKED = 'video:seeked';

  /**
   * 비디오에 에러가 발생했을 때 발생하는 이벤트
   */
  static VIDEO_ERROR = 'video:error';

  /**
   * 비디오가 클릭되었을 때 발생하는 이벤트
   */
  static VIDEO_CLICK = 'video:click';

  /**
   * 비디오 플레이어의 전체 화면 여부가 변경되었을 때 발생.
   */
  static CORE_FULLSCREENCHANGE = 'core:fullsceenchange';

  /**
   * 비디오 플레이어에서 키보드가 눌렸을 때 발생
   */
  static CORE_KEYDOWN = 'core:keydown';

  /**
   * 페이지의 전체 화면 여부가 변경되었을 때 발생.
   */
  static FULLSCREEN_CHANGE = 'fullscreen:change';

  /**
   * 비디오 플레이어를 재생했을 때 발생하는 이벤트.
   * 이 이벤트는 play() 등으로 비디오 플레이의 재생을 시도했을 때 발생한다.
   * 따라서 이벤트가 발생해도 비디오가 실제로 재생 중이 아닐 수 있다.
   */
  static PLAYER_PLAY = 'play';

  /**
   * 비디오 플레이어를 일시 정지했을 때 발생하는 이벤트
   */
  static PLAYER_PAUSE = 'pause';

  /**
   * 비디오의 볼륨이 변경되었을 때 발생하는 이벤트
   */
  static PLAYER_VOLUMECHANGE = 'volumechange';

  /**
   * 비디오 플레이어의 현재 시간이 변경될 때마다 발생하는 이벤트
   */
  static PLAYER_TIMEUPDATE = 'timeupdate';

  /**
   * 비디오 플레이어가 끝이났을 때 발생하는 이벤트
   */
  static PLAYER_ENDED = 'ended';

  /**
   * 비디오 플레이어 탐색을 시작했을 때 발생하는 이벤트
   */
  static PLAYER_SEEKING = 'seeking';

  /**
   * 비디오 플레이어 탐색을 끝마쳤을 때 발생하는 이벤트
   */
  static PLAYER_SEEKED = 'seeked';

  /**
   * 비디오 플레이어가 전체화면이 되었을 때 발생하는 이벤트
   */
  static PLAYER_REQUESTFULLSCREEN = 'requestfullscreen';

  /**
   * 비디오 플레이어의 전체화면이 해제되었을 때 발생하는 이벤트
   */
  static PLAYER_EXITFULLSCREEN = 'exitfullscreen';
}
