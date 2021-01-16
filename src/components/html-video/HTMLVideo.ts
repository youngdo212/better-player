/** @module components/html-video */

import type {
  Attributes,
  Config,
  EventHandlerNameMap,
  VideoError,
} from '../../types';
import './HTMLVideo.scss';
import Events from '../../base/events';
import Video from '../../base/video';
import mime from 'mime/lite';
import { canPlayVideoType } from '../../utils/element';
import i18n from '../../utils/i18n';

/**
 * HTML 비디오 엘리먼트를 나타내는 클래스
 *
 * @extends Video
 */
export default class HTMLVideo extends Video {
  private lastVolume: number;

  get attributes(): Attributes {
    return {
      class: 'better-player__html-video',
    };
  }

  get events(): EventHandlerNameMap {
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
      click: 'onClick',
    };
  }

  /**
   * 인스턴스를 생성하고 비디오 엘리먼트에 속성을 추가한다.
   */
  constructor(config: Config) {
    super(config);
    this.el.src = config.source;
    this.lastVolume = this.el.volume; // 음소거를 해제했을 때 이전 볼륨으로 되돌리기 위한 속성
  }

  /**
   * 재생 이벤트를 발생시킨다.
   */
  onPlay(event: Event): void {
    this.emit(Events.VIDEO_PLAY, event);
  }

  /**
   * 일시 정지 이벤트를 발생시킨다.
   */
  onPause(event: Event): void {
    this.emit(Events.VIDEO_PAUSE, event);
  }

  /**
   * 시간 변경 이벤트를 발생시킨다.
   */
  onTimeupdate(event: Event): void {
    this.emit(Events.VIDEO_TIMEUPDATE, event);
  }

  /**
   * 영상의 총 길이 변경 이벤트를 발생시킨다.
   */
  onDurationchange(event: Event): void {
    this.emit(Events.VIDEO_DURATIONCHANGE, event);
  }

  /**
   * 영상의 볼륨 변경 이벤트를 발생시킨다.
   */
  onVolumechange(event: Event): void {
    this.emit(Events.VIDEO_VOLUMECHANGE, event);
  }

  /**
   * 영상 끝 이벤트를 발생시킨다.
   */
  onEnded(event: Event): void {
    this.emit(Events.VIDEO_ENDED, event);
  }

  /**
   * 영상 탐색 이벤트를 발생시킨다.
   */
  onSeeking(event: Event): void {
    this.emit(Events.VIDEO_SEEKING, event);
  }

  /**
   * 영상 탐색 완료 이벤트를 발생시킨다.
   */
  onSeeked(event: Event): void {
    this.emit(Events.VIDEO_SEEKED, event);
  }

  /**
   * 비디오의 에러 이벤트를 발생시킨다
   */
  onError(): void {
    const error: VideoError = {
      message: i18n.get('notFoundVideo', this.config),
    };
    this.emit(Events.VIDEO_ERROR, error);
  }

  /**
   * 비디오의 클릭 이벤트를 발생시킨다.
   */
  onClick(event: Event): void {
    this.emit(Events.VIDEO_CLICK, event);
  }

  /**
   * 비디오의 정지 여부를 반환한다.
   */
  isPaused(): boolean {
    return this.el.paused;
  }

  /**
   * 비디오의 총 길이를 반환한다.
   *
   * @returns live stream이거나 아직 duration을 알 수 없는 경우 NaN을 반환한다
   */
  getDuration(): number {
    return this.el.duration;
  }

  /**
   * 비디오의 현재 시간을 반환한다.
   *
   * @return 초 단위
   */
  getCurrentTime(): number {
    return this.el.currentTime;
  }

  /**
   * 비디오의 볼륨을 반환한다.
   *
   * @returns 0 이상 1 이하의 값
   */
  getVolume(): number {
    return this.el.volume;
  }

  /**
   * 비디오 엘리먼트를 재생한다
   */
  play(): void {
    this.el.play();
  }

  /**
   * 비디오 엘리먼트를 일시 정지한다.
   */
  pause(): void {
    this.el.pause();
  }

  /**
   * 비디오를 탐색한다.
   *
   * @param time 초 단위의 부동수소점 시간
   */
  seek(time: number): void {
    if (time < 0) time = 0;
    if (time > this.getDuration()) time = this.getDuration();
    this.el.currentTime = time;
  }

  /**
   * 볼륨을 조절한다.
   *
   * @param volume 0 이상 1 이하의 값
   */
  setVolume(volume: number): void {
    if (volume < 0) volume = 0;
    if (volume > 1) volume = 1;
    this.lastVolume = volume;
    this.el.volume = volume;
  }

  /**
   * 비디오를 음소거한다.
   */
  mute(): void {
    this.el.volume = 0;
  }

  /**
   * 비디오 음소거를 해제하면서 음소거하기 전 볼륨으로 되돌린다.
   */
  unmute(): void {
    this.el.volume = this.lastVolume || 1;
  }

  /**
   * 비디오를 다시 로드한다.
   */
  reload(): void {
    this.el.load();
  }

  /**
   * DOM에서 엘리먼트를 제거하고 이벤트 리스너를 전부 삭제한다.
   * 또한 비디오 엘리먼트 src 속성을 초기화한다.
   */
  destroy(): HTMLVideo {
    super.destroy();
    this.el.removeAttribute('src');
    this.el.load(); // 진행중인 비디오 리소스의 다운로드를 중지한 후 초기화한 src를 재적용
    return this;
  }

  /**
   * 리소스가 이 인스턴스에서 재생 가능한 포맷인지 검사한다.
   *
   * @param source 확장자를 포함하는 비디오 url
   */
  static canPlayType(source: string): boolean {
    const mimeType = mime.getType(source) || '';

    return canPlayVideoType(mimeType);
  }
}
