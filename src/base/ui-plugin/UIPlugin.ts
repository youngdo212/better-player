/** @module base/ui-plugin */

import { hideElement, showElement } from '../../utils/element';
import UIObject from '../ui-object';
import Core from '../../components/core';
import Video from '../video';

/**
 * UI를 가지는 플러그인의 base 클래스
 *
 * @extends UIObject
 */
export default abstract class UIPlugin extends UIObject<'div'> {
  /**
   * 비디오 플레이어 코어
   */
  private _core: Core;

  /**
   * 플러그인 활성화 여부
   */
  private _enabled: boolean;

  /**
   * 모든 UI 플러그인은 내부에서 core를 갖는다.
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
   * 플러그인 활성화 여부
   */
  get enabled(): boolean {
    return this._enabled;
  }

  /**
   * core를 설정하고 이벤트 리스너를 등록한다.
   */
  constructor(core: Core) {
    super('div');
    this._core = core;
    this._enabled = true;
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
    if (this._enabled) return;
    this.addEventListeners();
    showElement(this.el);
    this._enabled = true;
  }

  /**
   * 플러그인을 작동하지 않도록 한다.
   */
  disable(): void {
    this.stopListening();
    hideElement(this.el);
    this._enabled = false;
  }

  /**
   * Core 엘리먼트에 플러그인 엘리먼트를 자식으로 추가한다.
   *
   * @returns {UIPlugin}
   */
  render(): UIPlugin {
    return this;
  }
}
