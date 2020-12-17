/** @module plugins/keyboard */

import Events from '../../base/events';
import Plugin from '../../base/plugin';

/**
 * 비디오 플레이어의 키보드 단축키를 제공하는 플러그인
 *
 * @extends Plugin
 */
export default class Keyboard extends Plugin {
  /**
   * 인스턴스를 생성하고 keyAction 매핑 객체를 속성으로 추가한다.
   * 키보드를 사용하지 않는 옵션을 줄 경우 disable을 한다.
   *
   * @param {module:components/core} core
   */
  constructor(core) {
    super(core);
    this.keyAction = {
      [keyMap['left']]: this.pressLeft.bind(this),
      [keyMap['right']]: this.pressRight.bind(this),
      [keyMap['up']]: this.pressUp.bind(this),
      [keyMap['down']]: this.pressDown.bind(this),
      [keyMap['space']]: this.pressSpaceBar.bind(this),
    };
    if (!core.config.keyboard) this.disable();
  }

  /**
   * 이벤트 리스너를 등록한다.
   */
  addEventListeners() {
    this.listenTo(this.core, Events.CORE_KEYDOWN, this.onKeydown);
    this.listenTo(this.video, Events.VIDEO_ERROR, this.disable);
  }

  /**
   * 키보드 이벤트를 처리한다.
   *
   * @param {KeyboardEvent} event
   */
  onKeydown(event) {
    event.preventDefault();
    this.keyAction[event.key]?.();
  }

  /**
   * 앞으로 감기를 수행한다.
   */
  pressRight() {
    this.video.seek(this.video.getCurrentTime() + this.core.config.seekTime);
  }

  /**
   * 되감기를 수행한다.
   */
  pressLeft() {
    this.video.seek(this.video.getCurrentTime() - this.core.config.seekTime);
  }

  /**
   * 볼륨을 높인다
   */
  pressUp() {
    this.video.setVolume(this.video.getVolume() + this.core.config.volumeStep);
  }

  /**
   * 볼륨을 낮춘다
   */
  pressDown() {
    this.video.setVolume(this.video.getVolume() - this.core.config.volumeStep);
  }

  /**
   * 비디오가 재생 상태일 경우 일시정지를, 일시 정지 상태일 경우 재생을 한다.
   */
  pressSpaceBar() {
    this.video.isPaused() ? this.video.play() : this.video.pause();
  }

  /**
   * 키보드 플러그인을 킨다. 키보드를 사용하지 않는 설정인 경우 키지 않는다.
   */
  enable() {
    if (!this.core.config.keyboard) return;
    super.enable();
  }
}

/**
 * key(식별자) : value(`KeyboardEvent.key`) 로 이루어진 맵핑 객체
 */
const keyMap = {
  left: 'ArrowLeft',
  right: 'ArrowRight',
  up: 'ArrowUp',
  down: 'ArrowDown',
  space: ' ',
};
