/** @module components/player */

import Events from '../../base/events';
import defaultConfig from '../../config/defaults';
import { getElementById } from '../../utils/element';
import { isObject } from '../../utils/type';
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
    this.config.source = this.normalizeSource(this.config);
    this.config.parentElement = this.getParentElement(this.config);

    // 비디오 플레이어 엘리먼트 생성 및 이벤트 리스너 추가
    this.core = new Core(this.config);
    this.addEventListeners();

    // DOM에 엘리먼트 추가
    this.core.render();
  }

  /**
   * source를 규정된 객체 형식으로 변환합니다
   *
   * @param {object} config
   * @param {object|string|undefined} config.source
   * @returns {{src, type?}}
   */
  normalizeSource({ source }) {
    if (isObject(source)) {
      source.src = source.src || '';
      return source;
    }

    return { src: source || '' };
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
   * 비디오 플레이어의 재생 여부를 반환한다.
   * @returns {boolean}
   */
  isPaused() {
    return this.core.video.isPaused();
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
