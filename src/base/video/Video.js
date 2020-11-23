/** @module base/video */

import UIObject from '../ui-object';

/**
 * 비디오 플레이어가 컨트롤할 멤버를 정의한 인터페이스와 같은 클래스
 * @extends UIObject
 */
export default class Video extends UIObject {
  /**
   * 비디오의 환경 설정 객체
   * @return object
   */
  get config() {
    return this._config;
  }

  /**
   * 환경 설정을 저장하고 인스턴스를 생성한다.
   * @param {object} config
   */
  constructor(config) {
    super();
    this._config = config;
  }

  /**
   * 재생 여부를 반환한다
   * @returns {boolean}
   */
  isPaused() {
    return true;
  }

  /**
   * 비디오를 재생한다
   */
  play() {}

  /**
   * 비디오를 일시 정지한다.
   */
  pause() {}
}
