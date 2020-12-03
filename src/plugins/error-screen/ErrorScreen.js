/** @module plugins/error-screen */

import './ErrorScreen.scss';
import UIPlugin from '../../base/ui-plugin';
import { appendChild, innerHTML } from '../../utils/element';
import template from './template';

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

  /**
   * 하위 엘리먼트를 렌더링하고 core에 자신을 추가한다
   *
   * @returns {ErrorScreen}
   */
  render() {
    innerHTML(this.el, template(this.core.config.i18n));
    appendChild(this.core.el, this.el);
    return this;
  }
}
