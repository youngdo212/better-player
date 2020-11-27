/** @module plugins/controller */

import './Controller.scss';
import UIPlugin from '../../base/ui-plugin';
import {
  appendChild,
  getElementByClassName,
  innerHTML,
} from '../../utils/element';
import template from './template';

/**
 * 비디오 플레이어를 조작하는 UI 플러그인
 *
 * @extends UIPlugin
 */
export default class Controller extends UIPlugin {
  get attributes() {
    return {
      class: 'better-player__controller',
    };
  }

  get events() {
    return {};
  }

  addEventListeners() {}

  /**
   * 생성된 하위 엘리먼트들을 캐싱한다
   */
  cacheElements() {
    this.$playButton = getElementByClassName(
      this.el,
      'better-player__play-button'
    );
  }

  /**
   * 하위 엘리먼트를 렌더링하고 core 엘리먼트에 자신을 추가한다.
   *
   * @returns {Controller}
   */
  render() {
    // 비디오 엘리먼트의 비디오가 재생 가능한 상태가 아닐 경우(NoVideo 경우 등) 자신을 렌더링하지 않는다.
    if (!this.core.video.canPlay) return;

    innerHTML(this.el, template());
    this.cacheElements();
    appendChild(this.core.el, this.el);
    return this;
  }
}
