/** @module components/html-video */

import './HTMLVideo.scss';
import Events from '../../base/events';
import Video from '../../base/video';
import mime from 'mime-types';
import { canPlayVideoType } from '../../utils/element';

/**
 * HTML 비디오 엘리먼트를 나타내는 클래스
 *
 * @extends Video
 */
export default class HTMLVideo extends Video {
  get tagName() {
    return 'video';
  }

  get attributes() {
    return {
      class: 'better-player__html-video',
    };
  }

  get events() {
    return {
      play: 'onPlay',
      pause: 'onPause',
    };
  }

  get canPlay() {
    return true;
  }

  /**
   * 인스턴스를 생성하고 비디오 엘리먼트에 속성을 추가한다.
   *
   * @param {object} config
   * @param {object} config.source
   * @param {string} config.source.src
   * @param {string=} config.source.type
   */
  constructor(config) {
    super(config);
    this.el.src = config.source.src;
    this.el.type = config.source.type || '';
  }

  /**
   * 재생 이벤트를 발생시킨다.
   *
   * @param {Event} event
   */
  onPlay(event) {
    this.emit(Events.VIDEO_PLAY, event);
  }

  /**
   * 일시 정지 이벤트를 발생시킨다.
   *
   * @param {Event} event
   */
  onPause(event) {
    this.emit(Events.VIDEO_PAUSE, event);
  }

  /**
   * 비디오의 정지 여부를 반환한다.
   *
   * @returns {boolean}
   */
  isPaused() {
    return this.el.paused;
  }

  /**
   * 비디오 엘리먼트를 재생한다
   */
  play() {
    this.el.play();
  }

  /**
   * 비디오 엘리먼트를 일시 정지한다.
   */
  pause() {
    this.el.pause();
  }

  /**
   * DOM에서 엘리먼트를 제거하고 이벤트 리스너를 전부 삭제한다.
   * 또한 비디오 엘리먼트 src 속성을 초기화한다.
   *
   * @returns {HTMLVideo}
   */
  destroy() {
    super.destroy();
    this.el.removeAttribute('src');
    this.el.load(); // 진행중인 비디오 리소스의 다운로드를 중지한 후 초기화한 src를 재적용
    return this;
  }

  /**
   * 리소스가 이 인스턴스에서 재생 가능한 포맷인지 검사한다.
   *
   * @param {object} source
   * @param {string} source.src
   * @param {string=} source.type
   */
  static canPlayType({ src, type }) {
    let mimeType = type;

    if (!mimeType) {
      mimeType = mime.lookup(src) || '';
    }

    return canPlayVideoType(mimeType);
  }
}
