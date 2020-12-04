/** @module components/html-video */

import './HTMLVideo.scss';
import Events from '../../base/events';
import Video from '../../base/video';
import mime from 'mime/lite';
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
      timeupdate: 'onTimeupdate',
      durationchange: 'onDurationchange',
      volumechange: 'onVolumechange',
      ended: 'onEnded',
      seeking: 'onSeeking',
      seeked: 'onSeeked',
      error: 'onError',
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
    this.lastVolume = this.el.volume; // 음소거를 해제했을 때 이전 볼륨으로 되돌리기 위한 속성
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
   * 시간 변경 이벤트를 발생시킨다.
   *
   * @param {Event} event
   */
  onTimeupdate(event) {
    this.emit(Events.VIDEO_TIMEUPDATE, event);
  }

  /**
   * 영상의 총 길이 변경 이벤트를 발생시킨다.
   *
   * @param {Event} event
   */
  onDurationchange(event) {
    this.emit(Events.VIDEO_DURATIONCHANGE, event);
  }

  /**
   * 영상의 볼륨 변경 이벤트를 발생시킨다.
   *
   * @param {Event} event
   */
  onVolumechange(event) {
    this.emit(Events.VIDEO_VOLUMECHANGE, event);
  }

  /**
   * 영상 끝 이벤트를 발생시킨다.
   *
   * @param {Event} event
   */
  onEnded(event) {
    this.emit(Events.VIDEO_ENDED, event);
  }

  /**
   * 영상 탐색 이벤트를 발생시킨다.
   *
   * @param {Event} event
   */
  onSeeking(event) {
    this.emit(Events.VIDEO_SEEKING, event);
  }

  /**
   * 영상 탐색 완료 이벤트를 발생시킨다.
   *
   * @param {Event} event
   */
  onSeeked(event) {
    this.emit(Events.VIDEO_SEEKED, event);
  }

  /**
   * 비디오의 에러 이벤트를 발생시킨다
   *
   * @param {Event} event
   */
  onError(event) {
    this.emit(Events.VIDEO_ERROR, event);
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
   * 비디오의 총 길이를 반환한다.
   *
   * @returns {number}
   */
  getDuration() {
    return this.el.duration;
  }

  /**
   * 비디오의 현재 시간을 반환한다.
   *
   * @returns {number}
   */
  getCurrentTime() {
    return this.el.currentTime;
  }

  /**
   * 비디오의 볼륨을 반환한다.
   *
   * @returns {number}
   */
  getVolume() {
    return this.el.volume;
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
   * 비디오를 탐색한다.
   * @param {number} time
   */
  seek(time) {
    if (time < 0) time = 0;
    this.el.currentTime = time;
  }

  /**
   * 볼륨을 조절한다.
   * @param {number} volume
   */
  setVolume(volume) {
    this.lastVolume = volume;
    this.el.volume = volume;
  }

  /**
   * 비디오를 음소거한다.
   */
  mute() {
    this.el.volume = 0;
  }

  /**
   * 비디오 음소거를 해제하면서 음소거하기 전 볼륨으로 되돌린다.
   */
  unmute() {
    this.el.volume = this.lastVolume || 1;
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
      mimeType = mime.getType(src) || '';
    }

    return canPlayVideoType(mimeType);
  }
}
