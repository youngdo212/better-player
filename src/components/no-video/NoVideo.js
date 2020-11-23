/** @module components/no-video */

import './NoVideo.scss';
import Video from '../../base/video';
import { innerHTML } from '../../utils/element';
import template from './template';

/**
 * 지원하지 않는 비디오 포맷을 리소스로 사용하거나 리소스를 아예 제공하지
 * 않을 경우 렌더링되는 mock 비디오
 * @extends Video
 */
export default class NoVideo extends Video {
  get attributes() {
    return { class: 'no-video' };
  }

  /**
   * 인스턴스를 생성한다
   * @param {object} options
   * @param {object} options.i18n
   */
  constructor(options) {
    super(options);
  }

  /**
   * 하위 엘리먼트를 렌더링한다.
   * @returns {NoVideo}
   */
  render() {
    innerHTML(this.el, template(this.options.i18n));
    return this;
  }

  /**
   * 재생 가능한 비디오 소스인지를 확인합니다.
   * NoVideo의 경우 어떤 비디오 소스인지 관심 없으므로 항상 true를 반환합니다.
   * @param {object=} source
   * @returns {true}
   */
  // eslint-disable-next-line no-unused-vars
  static canPlay(source) {
    return true;
  }
}
