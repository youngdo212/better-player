/** @module base/ui-plugin */

import UIObject from '../ui-object';

/**
 * UI를 가지는 플러그인의 base 클래스
 *
 * @extends UIObject
 */
export default class UIPlugin extends UIObject {
  /**
   * 모든 UI 플러그인은 내부에서 core를 갖는다.
   *
   * @returns {module:components/core}
   */
  get core() {
    return this._core;
  }

  /**
   * core를 통해서 video에 접근할 수 있다.
   *
   * @returns {module:base/video}
   */
  get video() {
    return this._core.video;
  }

  /**
   * core를 설정하고 이벤트 리스너를 등록한다.
   * @param {module:components/core} core
   */
  constructor(core) {
    super();
    this._core = core;
    this.addEventListeners();
  }

  /**
   * Core에 이벤트 리스너를 등록한다.
   */
  addEventListeners() {}

  /**
   * Core 엘리먼트에 플러그인 엘리먼트를 자식으로 추가한다.
   *
   * @returns {UIPlugin}
   */
  render() {
    return this;
  }
}
