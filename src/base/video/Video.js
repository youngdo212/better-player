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
   * 재생 가능한 상태인지를 나타낸다.
   * 이 속성을 이용해 플러그인들이 자신의 렌더링 여부를 결정한다(e.g. Controller).
   * @returns {boolean}
   */
  get canPlay() {
    return false;
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
   * 영상의 총 길이를 반환한다.
   * @returns {number}
   */
  getDuration() {
    return NaN;
  }

  /**
   * 영상의 현재 시간을 반환한다
   * @returns {number}
   */
  getCurrentTime() {
    return 0;
  }

  /**
   * 영상의 볼륨을 반환한다
   * @returns {number}
   */
  getVolume() {
    return 0;
  }

  /**
   * 비디오를 재생한다
   */
  play() {}

  /**
   * 비디오를 일시 정지한다.
   */
  pause() {}

  /**
   * 영상을 탐색한다
   * @param {number} time
   */
  seek(time) {} // eslint-disable-line

  /**
   * 볼륨을 조절한다
   * @param {number} volume
   */
  setVolume(volume) {} // eslint-disable-line
}
