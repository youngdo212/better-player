/** @module components/core */

import './Core.scss';
import UIObject from '../../base/ui-object';
import { appendChild } from '../../utils/element';
import VideoFactory from '../video-factory';
import Controller from '../../plugins/controller';
import loadSprite from '../../utils/load-sprite';
import Events from '../../base/events';
import Fullscreen from '../fullscreen';
import ErrorScreen from '../../plugins/error-screen';

const plugins = [Controller, ErrorScreen];

/**
 * 비디오 플레이어의 핵심 클래스
 * 비디오 플레이어 그 자체 엘리먼트를 가지고 있으며 다양한 컴포넌트를 제공한다.
 * 컴포넌트간의 소통은 항상 Core를 거친다.
 *
 * @extends UIObject
 */
export default class Core extends UIObject {
  get attributes() {
    return {
      class: 'better-player',
    };
  }

  /**
   * 환경 설정 객체를 이용해 인스턴스를 생성한다.
   *
   * @param {object} config
   * @param {HTMLElement=} config.parentElement
   * @param {object} config.source
   * @param {object} config.i18n
   * @param {number=} config.width
   * @param {number=} config.height
   * @param {string} config.iconUrl
   */
  constructor(config) {
    super();
    this.config = config;
    this.videoFactory = new VideoFactory(this.config);
    this.video = this.videoFactory.create();
    this.plugins = plugins.map(Plugin => new Plugin(this));
    this.fullscreen = new Fullscreen();
    this.addEventListeners();
  }

  /**
   * 하위 컴포넌트에 이벤트 리스너를 등록한다.
   */
  addEventListeners() {
    this.fullscreen.on(Events.FULLSCREEN_CHANGE, this.onFullscreenChange, this);
  }

  /**
   *
   * @param {Event} event
   */
  onFullscreenChange(event) {
    this.emit(Events.CORE_FULLSCREENCHANGE, event);
  }

  /**
   * 전체화면 여부를 반환한다.
   *
   * @returns {boolean}
   */
  isFullscreen() {
    return this.fullscreen.element === this.el;
  }

  /**
   * 비디오 플레이어를 전체 화면으로 전환한다.
   */
  requestFullscreen() {
    this.fullscreen.request(this.el);
  }

  /**
   * 비디오 플레이어를 전체 화면에서 나오게 한다.
   */
  exitFullscreen() {
    this.fullscreen.exit();
  }

  /**
   * 환경 설정에 따라 엘리먼트의 사이즈를 변경한다
   */
  updateSize() {
    this.el.style.width = this.config.width ? `${this.config.width}px` : '';
    this.el.style.height = this.config.height ? `${this.config.height}px` : '';
  }

  /**
   * 하위 엘리먼트를 렌더링하고 부모 엘리먼트에 core 엘리먼트를 추가한다.
   *
   * @returns {Core}
   */
  render() {
    this.updateSize();
    appendChild(this.el, this.video.render().el);
    this.plugins.forEach(plugin => plugin.render());
    loadSprite(this.config.iconUrl);

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
    this.plugins.forEach(plugin => plugin.destroy());
    this.fullscreen.destroy();
    return this;
  }
}
