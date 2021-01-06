/** @module base/plugin */

import Events from '../events';
import Core from '../../components/core';
import Video from '../video';

/**
 * UI를 가지지 않는 플러그인의 베이스 클래스
 *
 * @extends Events
 */
export default abstract class Plugin extends Events {
  /**
   * 비디오 플레이어 코어
   */
  private _core: Core;

  /**
   * 플러그인의 활성화 여부
   */
  public enabled: boolean;

  /**
   * 모든 플러그인은 내부에서 core를 갖는다.
   */
  get core(): Core {
    return this._core;
  }

  /**
   * core를 통해서 video에 접근할 수 있다.
   */
  get video(): Video {
    return this._core.video;
  }

  /**
   * core를 설정하고 이벤트 리스너를 등록한다.
   */
  constructor(core: Core) {
    super();
    this._core = core;
    this.enabled = true;
    this.addEventListeners();
  }

  /**
   * Core에 이벤트 리스너를 등록한다.
   * NOTE: disable/enable을 제대로 작동시키기 위해서 반드시 this.listenTo 메소드를 이용해 이벤트 리스너를 등록해야한다.
   */
  abstract addEventListeners(): void;

  /**
   * 플러그인을 작동시킨다.
   * 이 함수는 disable 이후에 다시 플러그인을 작동시킬 때만 사용해야 한다.
   */
  enable(): void {
    if (this.enabled) return;
    this.addEventListeners();
    this.enabled = true;
  }

  /**
   * 플러그인을 작동하지 않도록 한다.
   */
  disable(): void {
    this.stopListening();
    this.enabled = false;
  }

  /**
   * 플러그인을 파괴하여 등록된 이벤트 리스너를 전부 제거한다.
   */
  destroy(): Plugin {
    this.off();
    this.stopListening();
    return this;
  }
}
