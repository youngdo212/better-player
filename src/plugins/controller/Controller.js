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
    innerHTML(this.el, template());
    this.cacheElements();
    appendChild(this.core.el, this.el);
    return this;
  }
}
