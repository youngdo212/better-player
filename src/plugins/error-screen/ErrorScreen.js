/** @module plugins/error-screen */

import './ErrorScreen.scss';
import UIPlugin from '../../base/ui-plugin';
import {
  addClass,
  appendChild,
  innerHTML,
  removeClass,
} from '../../utils/element';
import template from './template';
import Events from '../../base/events';

/**
 * 비디오 리소스를 서버에서 찾을 수 없는 경우 나타나는 UI 플러그인
 *
 * @extends UIPlugin
 */
export default class ErrorScreen extends UIPlugin {
  get attributes() {
    return {
      class: 'better-player__error-screen',
    };
  }

  get events() {
    return {
      'click .better-player__reload-button': 'reload',
    };
  }

  /**
   * 인스턴스를 생성하고 초기 상태로 자신을 숨긴다.
   *
   * @param {module:components/core} core
   */
  constructor(core) {
    super(core);
    this.hide();
  }

  /**
   * 비디오 컴포넌트에 에러 이벤트 핸들러를 등록한다
   */
  addEventListeners() {
    this.listenTo(this.video, Events.VIDEO_ERROR, this.show);
  }

  /**
   * 에러가 발생하지 않았기 때문에 에러 스크린을 보이지 않게 한다
   */
  hide() {
    addClass(this.el, 'better-player__error-screen--hide');
  }

  /**
   * 에러가 발생해서 에러 스크린이 보이게 한다
   */
  show() {
    removeClass(this.el, 'better-player__error-screen--hide');
  }

  /**
   * 비디오 플레이어를 리로드 한다.
   */
  reload() {
    this.hide();
    this.core.reload();
  }

  /**
   * 하위 엘리먼트를 렌더링하고 core에 자신을 추가한다
   *
   * @returns {ErrorScreen}
   */
  render() {
    // 비디오 엘리먼트의 비디오가 재생 가능한 상태가 아닐 경우(NoVideo 경우 등) 자신을 렌더링하지 않는다.
    if (!this.video.canPlay) return;

    innerHTML(this.el, template(this.core.config.i18n));
    appendChild(this.core.el, this.el);
    return this;
  }
}
