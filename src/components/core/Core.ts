/** @module components/core */

import type { Attributes, Config, EventHandlerNameMap } from '../../types';
import './Core.scss';
import UIObject from '../../base/ui-object';
import { appendChild } from '../../utils/element';
import VideoFactory from '../video-factory';
import Controller from '../../plugins/controller';
import loadSprite from '../../utils/load-sprite';
import Events from '../../base/events';
import Fullscreen from '../fullscreen';
import ErrorScreen from '../../plugins/error-screen';
import ClickToPlay from '../../plugins/click-to-play';
import Keyboard from '../../plugins/keyboard';
import Video from '../../base/video';
import Plugin from '../../base/plugin';
import UIPlugin from '../../base/ui-plugin';

const plugins = [Controller, ErrorScreen, ClickToPlay, Keyboard];

/**
 * 비디오 플레이어의 핵심 클래스
 * 비디오 플레이어 그 자체 엘리먼트를 가지고 있으며 다양한 컴포넌트를 제공한다.
 * 컴포넌트간의 소통은 항상 Core를 거친다.
 *
 * @extends UIObject
 */
export default class Core extends UIObject<'div'> {
  readonly config: Config;
  readonly videoFactory: VideoFactory;
  readonly video: Video;
  readonly plugins: (Plugin | UIPlugin)[];
  readonly fullscreen: Fullscreen;

  get attributes(): Attributes {
    return {
      class: 'better-player',
      tabindex: '-1',
    };
  }

  get events(): EventHandlerNameMap {
    return {
      keydown: 'onKeydown',
    };
  }

  /**
   * 환경 설정 객체를 이용해 인스턴스를 생성한다.
   */
  constructor(config: Config) {
    super('div');
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
  addEventListeners(): void {
    this.fullscreen.on(Events.FULLSCREEN_CHANGE, this.onFullscreenChange, this);
  }

  /**
   * 전체화면 변경 이벤트를 발생시킨다.
   */
  onFullscreenChange(event: Event): void {
    this.emit(Events.CORE_FULLSCREENCHANGE, event);
  }

  /**
   * 키보드 누름 이벤트를 발생시킨다.
   */
  onKeydown(event: Event): void {
    this.emit(Events.CORE_KEYDOWN, event);
  }

  /**
   * 전체화면 여부를 반환한다.
   */
  isFullscreen(): boolean {
    return this.fullscreen.element === this.el;
  }

  /**
   * 비디오 플레이어를 전체 화면으로 전환한다.
   */
  requestFullscreen(): void {
    this.fullscreen.request(this.el);
  }

  /**
   * 비디오 플레이어를 전체 화면에서 나오게 한다.
   */
  exitFullscreen(): void {
    this.fullscreen.exit();
  }

  /**
   * 환경 설정에 따라 엘리먼트의 사이즈를 변경한다
   */
  updateSize(): void {
    this.el.style.width = this.config.width ? `${this.config.width}px` : '';
    this.el.style.height = this.config.height ? `${this.config.height}px` : '';
  }

  /**
   * 비디오 플레이어를 리로드한다.
   * 비디오 엘리먼트의 src를 변경하지 않고 다시 로드하고 disable된 플러그인들을 enable 상태로 만든다.
   */
  reload(): void {
    this.video.reload();
    this.plugins.forEach(plugin => plugin.enable());
  }

  /**
   * 비디오를 렌더링한다.
   */
  renderVideo(): void {
    appendChild(this.el, this.video.render().el);
  }

  /**
   * 플러그인을 렌더링한다.
   */
  renderPlugins(): void {
    this.plugins.forEach(plugin => {
      if ('render' in plugin) {
        plugin.render();
      }
    });
  }

  /**
   * 하위 엘리먼트를 렌더링하고 부모 엘리먼트에 core 엘리먼트를 추가한다.
   */
  render(): Core {
    this.updateSize();
    this.renderVideo();
    this.renderPlugins();
    loadSprite(this.config.iconUrl);

    if (this.config.parentElement) {
      appendChild(this.config.parentElement, this.el);
    }

    return this;
  }

  /**
   * 자신 및 하위 엘리먼트를 전부 파괴한다.
   */
  destroy(): Core {
    super.destroy();
    this.videoFactory.off();
    this.video.destroy();
    this.plugins.forEach(plugin => plugin.destroy());
    this.fullscreen.destroy();
    return this;
  }
}
