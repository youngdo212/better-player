/** @module plugins/keyboard */

import Events from '../../base/events';
import Plugin from '../../base/plugin';
import Core from '../../components/core';
import { Values } from '../../types';
import { isValidEnumValue } from '../../utils/enum';

/**
 * key(식별자) : value(`KeyboardEvent.key`) 로 이루어진 맵핑 객체
 */
enum KeyboardEventKeyValueMap {
  Left = 'ArrowLeft',
  Right = 'ArrowRight',
  Up = 'ArrowUp',
  Down = 'ArrowDown',
  Space = ' ',
}

/**
 * 비디오 플레이어의 키보드 단축키를 제공하는 플러그인
 *
 * @extends Plugin
 */
export default class Keyboard extends Plugin {
  private keyAction: Record<
    Values<typeof KeyboardEventKeyValueMap>,
    () => void
  >;

  /**
   * 인스턴스를 생성하고 keyAction 매핑 객체를 속성으로 추가한다.
   * 키보드를 사용하지 않는 옵션을 줄 경우 disable을 한다.
   */
  constructor(core: Core) {
    super(core);
    this.keyAction = {
      [KeyboardEventKeyValueMap.Left]: this.pressLeft.bind(this),
      [KeyboardEventKeyValueMap.Right]: this.pressRight.bind(this),
      [KeyboardEventKeyValueMap.Up]: this.pressUp.bind(this),
      [KeyboardEventKeyValueMap.Down]: this.pressDown.bind(this),
      [KeyboardEventKeyValueMap.Space]: this.pressSpaceBar.bind(this),
    };
    if (!core.config.keyboard) this.disable();
  }

  /**
   * 이벤트 리스너를 등록한다.
   */
  protected addEventListeners(): void {
    this.listenTo(this.core, Events.CORE_KEYDOWN, this.onKeydown);
    this.listenTo(this.video, Events.VIDEO_ERROR, this.disable);
  }

  /**
   * 키보드 이벤트를 처리한다.
   */
  private onKeydown(event: KeyboardEvent): void {
    event.preventDefault();
    const { key } = event;
    if (isValidKey(key)) {
      this.keyAction[key]();
    }
  }

  /**
   * 앞으로 감기를 수행한다.
   */
  private pressRight(): void {
    this.video.seek(this.video.getCurrentTime() + this.core.config.seekTime);
  }

  /**
   * 되감기를 수행한다.
   */
  private pressLeft(): void {
    this.video.seek(this.video.getCurrentTime() - this.core.config.seekTime);
  }

  /**
   * 볼륨을 높인다
   */
  private pressUp(): void {
    this.video.setVolume(this.video.getVolume() + this.core.config.volumeStep);
  }

  /**
   * 볼륨을 낮춘다
   */
  private pressDown(): void {
    this.video.setVolume(this.video.getVolume() - this.core.config.volumeStep);
  }

  /**
   * 비디오가 재생 상태일 경우 일시정지를, 일시 정지 상태일 경우 재생을 한다.
   */
  private pressSpaceBar(): void {
    this.video.isPaused() ? this.video.play() : this.video.pause();
  }

  /**
   * 키보드 플러그인을 킨다. 키보드를 사용하지 않는 설정인 경우 키지 않는다.
   */
  public enable(): void {
    if (!this.core.config.keyboard) return;
    super.enable();
  }
}

/**
 * KeyboardEvent의 key 값이 Keyboard 클래스에서 사용 가능한 값인지 확인한다.
 *
 * @param key KeyboardEvent.key
 */
function isValidKey(
  key: string,
): key is Values<typeof KeyboardEventKeyValueMap> {
  return isValidEnumValue(KeyboardEventKeyValueMap, key);
}
