/** @module components/core */

import UIObject from '../../base/ui-object';
import { appendChild } from '../../utils/element';
import VideoFactory from '../video-factory';

/**
 * 비디오 플레이어의 핵심 클래스
 * 비디오 플레이어 그 자체 엘리먼트를 가지고 있으며 다양한 컴포넌트를 제공한다.
 * 컴포넌트간의 소통은 항상 Core를 거친다.
 *
 * @extends UIObject
 */
export default class Core extends UIObject {
  /**
   * 환경 설정 객체를 이용해 인스턴스를 생성한다.
   *
   * @param {object} config
   * @param {HTMLElement=} config.parentElement
   * @param {object} config.source
   * @param {object} config.i18n
   */
  constructor(config) {
    super();
    this.config = config;
    this.videoFactory = new VideoFactory(this.config);
    this.video = this.videoFactory.create();
  }

  /**
   * 하위 엘리먼트를 렌더링하고 부모 엘리먼트에 core 엘리먼트를 추가한다.
   *
   * @returns {Core}
   */
  render() {
    appendChild(this.el, this.video.render().el);

    if (this.config.parentElement) {
      appendChild(this.config.parentElement, this.el);
    }

    return this;
  }

  /**
   * 자신 및 하위 엘리먼트를 전부 파괴한다.
   *
   * @returns {Core}
   */
  destroy() {
    super.destroy();
    this.videoFactory.off();
    this.video.destroy();
    return this;
  }
}
