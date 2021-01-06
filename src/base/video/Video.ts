/** @module base/video */

import UIObject from '../ui-object';
import type { Config } from '../../types';

/**
 * 비디오 플레이어가 컨트롤할 비디오 클래스
 * @extends UIObject
 */
export default abstract class Video extends UIObject {
  /**
   * 비디오 플레이어 환경설정 객체
   */
  private _config: Config;

  /**
   * 비디오의 환경 설정 객체
   */
  get config(): Config {
    return this._config;
  }

  /**
   * 재생 가능한 상태인지를 나타낸다.
   * 이 속성을 이용해 플러그인들이 자신의 렌더링 여부를 결정한다(e.g. Controller).
   */
  get canPlay(): boolean {
    return false;
  }

  /**
   * 환경 설정을 저장하고 인스턴스를 생성한다.
   */
  constructor(config: Config) {
    super();
    this._config = config;
  }

  /**
   * 재생 여부를 반환한다
   */
  isPaused(): boolean {
    return true;
  }

  /**
   * 영상의 총 길이를 반환한다.
   */
  getDuration(): number {
    return NaN;
  }

  /**
   * 영상의 현재 시간을 반환한다
   */
  getCurrentTime(): number {
    return 0;
  }

  /**
   * 영상의 볼륨을 반환한다
   */
  getVolume(): number {
    return 1;
  }

  /**
   * 비디오를 재생한다
   */
  play(): void {
    // do nothing.
  }

  /**
   * 비디오를 일시 정지한다.
   */
  pause(): void {
    // do nothing.
  }

  /**
   * 영상을 탐색한다
   * @param time 초 단위의 소수점 숫자
   */
  seek(time: number): void {
    // do nothing.
  }

  /**
   * 볼륨을 조절한다
   * @param volume 0 이상 1 이하의 값
   */
  setVolume(volume: number): void {
    // do nothing.
  }

  /**
   * 음소거한다.
   */
  mute(): void {
    // do nothing.
  }

  /**
   * 음소거를 해제한다.
   */
  unmute(): void {
    // do nothing.
  }

  /**
   * 설정된 url로 비디오를 다시 로드한다.
   */
  reload(): void {
    // do nothing.
  }
}
