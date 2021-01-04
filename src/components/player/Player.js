/** @module components/player */

import Events from '../../base/events';
import defaultConfig from '../../config/defaults';
import { getElementById } from '../../utils/element';
import Core from '../core';

/**
 * 비디오 플레이어 기능을 제공하기 위한 wrapper 클래스
 * @extends Events
 */
export default class Player extends Events {
  /**
   * 환경 설정 및 core를 생성하고 관련 이벤트 리스너를 등록합니다.
   * @param {object=} options
   */
  constructor(options = {}) {
    super();

    // 환경 설정
    this.config = { ...defaultConfig, ...options };
    this.config.parentElement = this.getParentElement(this.config);

    // 비디오 플레이어 엘리먼트 생성 및 이벤트 리스너 추가
    this.core = new Core(this.config);
    this.addEventListeners();

    // DOM에 엘리먼트 추가
    this.core.render();
  }

  /**
   * 비디오 엘리먼트가 추가될 부모 엘리먼트를 반환합니다.
   *
   * @param {object} config
   * @returns {HTMLElement | null}
   */
  getParentElement(config) {
    let parentElement = null;

    if (config.parentId) {
      parentElement = getElementById(config.parentId);
    } else if (config.parent) {
      parentElement = config.parent;
    }

    return parentElement;
  }

  /**
   * 이벤트 리스너를 전부 등록합니다
   */
  addEventListeners() {
    this.core.video.on(Events.VIDEO_PLAY, this.onPlay.bind(this));
    this.core.video.on(Events.VIDEO_PAUSE, this.onPause.bind(this));
    this.core.video.on(
      Events.VIDEO_VOLUMECHANGE,
      this.onVolumechange.bind(this)
    );
    this.core.video.on(Events.VIDEO_TIMEUPDATE, this.onTimeupdate.bind(this));
    this.core.video.on(Events.VIDEO_ENDED, this.onEnded.bind(this));
    this.core.video.on(Events.VIDEO_SEEKING, this.onSeeking.bind(this));
    this.core.video.on(Events.VIDEO_SEEKED, this.onSeeked.bind(this));
    this.core.on(
      Events.CORE_FULLSCREENCHANGE,
      this.onFullscreenchange.bind(this)
    );
  }

  /**
   * 재생 이벤트를 발생시킨다
   *
   * @param {Event} event
   */
  onPlay(event) {
    this.emit(Events.PLAYER_PLAY, event);
  }

  /**
   * 일시 정지 이벤트를 발생시킨다
   *
   * @param {Event} event
   */
  onPause(event) {
    this.emit(Events.PLAYER_PAUSE, event);
  }

  /**
   * 비디오의 볼륨 변경 이벤트를 발생시킨다.
   *
   * @param {Event} event
   */
  onVolumechange(event) {
    this.emit(Events.PLAYER_VOLUMECHANGE, event);
  }

  /**
   * 비디오 현재 시간 변경 이벤트를 발생시킨다.
   *
   * @param {Event} event
   */
  onTimeupdate(event) {
    this.emit(Events.PLAYER_TIMEUPDATE, event);
  }

  /**
   * 비디오 끝 이벤트를 발생시킨다.
   *
   * @param {Event} event
   */
  onEnded(event) {
    this.emit(Events.PLAYER_ENDED, event);
  }

  /**
   * 비디오 탐색 시작 이벤트를 발생시킨다.
   *
   * @param {Event} event
   */
  onSeeking(event) {
    this.emit(Events.PLAYER_SEEKING, event);
  }

  /**
   * 비디오 탐색 완료 이벤트를 발생시킨다.
   *
   * @param {Event} event
   */
  onSeeked(event) {
    this.emit(Events.PLAYER_SEEKED, event);
  }

  /**
   * 전체화면 이벤트를 발생시킨다.
   *
   * @param {Event} event
   */
  onFullscreenchange(event) {
    this.core.isFullscreen()
      ? this.emit(Events.PLAYER_REQUESTFULLSCREEN, event)
      : this.emit(Events.PLAYER_EXITFULLSCREEN, event);
  }

  /**
   * 비디오 플레이어의 재생 여부를 반환한다.
   * @returns {boolean}
   */
  isPaused() {
    return this.core.video.isPaused();
  }

  /**
   * 비디오의 현재 시간을 반환한다.
   *
   * @returns {number} 부동소수점을 가진 초 단위의 숫자
   */
  getCurrentTime() {
    return this.core.video.getCurrentTime();
  }

  /**
   * 비디오의 총 길이를 반환합니다.
   *
   * @returns {number} 부동소수점을 가진 초 단위의 숫자
   */
  getDuration() {
    return this.core.video.getDuration();
  }

  /**
   * 비디오의 볼륨을 반환한다.
   *
   * @returns {number} 0 이상 1 이하의 값
   */
  getVolume() {
    return this.core.video.getVolume();
  }

  /**
   * 음소거 여부를 반환한다.
   *
   * @returns {boolean}
   */
  isMuted() {
    return this.core.video.getVolume() === 0;
  }

  /**
   * 비디오 플레이어의 전체 화면 여부를 반환한다.
   *
   * @returns {boolean}
   */
  isFullscreen() {
    return this.core.isFullscreen();
  }

  /**
   * 비디오 플레이어를 재생한다.
   */
  play() {
    this.core.video.play();
  }

  /**
   * 비디오 플레이어를 일시 정지한다.
   */
  pause() {
    this.core.video.pause();
  }

  /**
   * 초 단위의 숫자로 비디오를 탐색한다.
   *
   * @param {number} time
   */
  seek(time) {
    this.core.video.seek(time);
  }

  /**
   * 비디오의 볼륨을 변경한다.
   *
   * @param {number} volume 0 이상 1 이하의 숫자
   */
  setVolume(volume) {
    this.core.video.setVolume(volume);
  }

  /**
   * 비디오를 음소거한다.
   */
  mute() {
    this.core.video.mute();
  }

  /**
   * 비디오 음소거를 해제한다.
   * 음소거를 해제할 경우 음소거하기 전 볼륨으로 되돌린다
   */
  unmute() {
    this.core.video.unmute();
  }

  /**
   * 비디오 플레이어를 전체화면으로 전환한다.
   */
  requestFullscreen() {
    this.core.requestFullscreen();
  }

  /**
   * 비디오 플레이어 전체화면을 해제한다.
   */
  exitFullscreen() {
    this.core.exitFullscreen();
  }

  /**
   * 등록된 이벤트 리스너를 전부 삭제하고 DOM에서 비디오 플레이어를 제거한다.
   *
   * @returns {Player}
   */
  destroy() {
    this.off();
    this.core.destroy();
    return this;
  }
}
