/** @module plugins/controller */

import './Controller.scss';
import UIPlugin from '../../base/ui-plugin';
import {
  addClass,
  appendChild,
  getElementByClassName,
  innerHTML,
  removeClass,
} from '../../utils/element';
import template from './template';
import Events from '../../base/events';
import { isNumber } from '../../utils/type';
import formatTime from '../../utils/time';

/**
 * 비디오 플레이어를 조작하는 UI 플러그인
 *
 * @extends UIPlugin
 */
export default class Controller extends UIPlugin {
  get attributes() {
    return {
      class: 'better-player__controller',
    };
  }

  get events() {
    return {
      'click .better-player__play-toggle-button': 'togglePlay',
      'click .better-player__seek-bar': 'seek',
      'click .better-player__mute-toggle-button': 'toggleMute',
      'click .better-player__fullscreen-toggle-button': 'toggleFullscreen',
      'mousedown .better-player__seek-bar': 'startSeekDrag',
      'input .better-player__seek-bar': 'updateCurrentTime',
      'input .better-player__volume-bar': 'setVolume',
    };
  }

  /**
   * 인스턴스를 생성한다.
   * @param {module:components/core} core
   */
  constructor(core) {
    super(core);
    this.isDraggingSeekBar = false; // seek bar를 드래그 중인지 나타내는 값
    this.playOnSeeked = false; // seek 작업 수행 후 비디오를 플레이할 지를 나타내는 값
  }

  /**
   * 컴포넌트에 이벤트 리스너를 등록한다.
   */
  addEventListeners() {
    this.listenTo(this.video, Events.VIDEO_PLAY, this.updatePlayToggleButton);
    this.listenTo(this.video, Events.VIDEO_PAUSE, this.updatePlayToggleButton);
    this.listenTo(this.video, Events.VIDEO_TIMEUPDATE, this.onTimeupdate);
    this.listenTo(this.video, Events.VIDEO_DURATIONCHANGE, this.updateDuration);
    this.listenTo(this.video, Events.VIDEO_VOLUMECHANGE, this.onVolumeChange);
    this.listenTo(
      this.core,
      Events.CORE_FULLSCREENCHANGE,
      this.updateFullscreenToggleButton
    );
  }

  /**
   * 비디오가 정지된 상태일 경우 비디오를 재생시키고, 재생 중인 경우 일시 정지시킨다.
   */
  togglePlay() {
    this.video.isPaused() ? this.play() : this.pause();
  }

  /**
   * 비디오를 재생시킨다.
   */
  play() {
    this.video.play();
  }

  /**
   * 비디오를 일시 정지시킨다.
   */
  pause() {
    this.video.pause();
  }

  /**
   * seek bar의 드래그를 시작한다.
   */
  startSeekDrag() {
    if (!this.video.isPaused()) {
      this.video.pause();
      this.playOnSeeked = true;
    }
    this.isDraggingSeekBar = true;
  }

  /**
   * 비디오 시간을 seek bar를 바탕으로 변경한다.
   */
  seek() {
    const duration = this.video.getDuration();
    const time = Number(this.$seekBar.value) * duration;

    this.video.seek(time);
    this.isDraggingSeekBar = false;

    if (this.playOnSeeked) {
      this.video.play();
      this.playOnSeeked = false;
    }
  }

  /**
   * volume-bar를 바탕으로 비디오의 볼륨을 조절한다
   */
  setVolume() {
    const volume = Number(this.$volumeBar.value);
    this.video.setVolume(volume);
  }

  /**
   * 비디오의 볼륨이 없을 경우 음소거를 해제하고, 반대의 경우 음소거한다.
   */
  toggleMute() {
    this.video.getVolume() ? this.mute() : this.unmute();
  }

  /**
   * 비디오를 음소거한다.
   */
  mute() {
    this.video.mute();
  }

  /**
   * 비디오 음소거를 해제한다.
   */
  unmute() {
    this.video.unmute();
  }

  /**
   * 비디오 플레이어를 전체 화면으로 전환시키고, 이미 전체 화면인 경우
   * 전체 화면에서 탈출시킨다
   */
  toggleFullscreen() {
    this.core.isFullscreen() ? this.exitFullscreen() : this.requestFullscreen();
  }

  /**
   * 비디오 플레이어를 전체 화면으로 전환한다.
   */
  requestFullscreen() {
    this.core.requestFullscreen();
  }

  /**
   * 비디오 플레이어의 전체 화면을 해제한다.
   */
  exitFullscreen() {
    this.core.exitFullscreen();
  }

  /**
   * 비디오의 재생 여부에 따라서 토글 버튼의 아이콘을 변경한다.
   */
  updatePlayToggleButton() {
    if (this.video.isPaused()) {
      removeClass(
        this.$playToggleButton,
        'better-player__toggle-button--pressed'
      );
    } else {
      addClass(this.$playToggleButton, 'better-player__toggle-button--pressed');
    }
  }

  /**
   * 비디오의 현재 시간에 따라서 seek bar의 value를 변경한다.
   */
  updateSeekBar() {
    if (this.isDraggingSeekBar) return; // seek bar를 드래그 중인 경우 업데이트하지 않는다.
    const duration = this.video.getDuration();
    const currentTime = this.video.getCurrentTime();
    const value = currentTime / duration;
    this.$seekBar.value = isNumber(value) ? value : 0;
  }

  /**
   * 영상의 총 길이를 업데이트한다.
   */
  updateDuration() {
    const duration = this.video.getDuration() || 0;
    this.$duration.textContent = formatTime(duration);
  }

  /**
   * seek bar의 위치를 바탕으로 현재 시간을 변경한다
   */
  updateCurrentTime() {
    const duration = this.video.getDuration();
    const currentTime = Number(this.$seekBar.value) * duration;
    this.$currentTime.textContent = formatTime(currentTime);
  }

  /**
   * 비디오의 시간 변경 이벤트를 처리한다.
   * seek bar와 현재 시간을 업데이트한다.
   */
  onTimeupdate() {
    this.updateSeekBar();
    this.updateCurrentTime();
  }

  /**
   * 비디오의 볼륨이 변경되었을 때 컨트롤러 볼륨 관련 UI를 변경한다.
   */
  onVolumeChange() {
    this.updateVolumeBar();
    this.updateMuteToggleButton();
  }

  /**
   * volume bar를 비디오의 볼륨을 바탕으로 변경한다.
   */
  updateVolumeBar() {
    const volume = this.video.getVolume();
    this.$volumeBar.value = volume;
  }

  /**
   * 비디오의 볼륨이 0이면 음소거 버튼으로, 그렇지 않은 경우 비음소거 버튼으로 변경한다.
   */
  updateMuteToggleButton() {
    const volume = this.video.getVolume();
    if (volume === 0) {
      addClass(this.$muteToggleButton, 'better-player__toggle-button--pressed');
    } else {
      removeClass(
        this.$muteToggleButton,
        'better-player__toggle-button--pressed'
      );
    }
  }

  /**
   * 전체화면인 경우 전체 화면 탈출 버튼으로, 그렇지 않은 경우 전체 화면 버튼으로 변경한다.
   */
  updateFullscreenToggleButton() {
    if (this.core.isFullscreen()) {
      addClass(
        this.$fullscreenToggleButton,
        'better-player__toggle-button--pressed'
      );
    } else {
      removeClass(
        this.$fullscreenToggleButton,
        'better-player__toggle-button--pressed'
      );
    }
  }

  /**
   * 생성된 하위 엘리먼트들을 캐싱한다
   */
  cacheElements() {
    this.$playToggleButton = getElementByClassName(
      this.el,
      'better-player__play-toggle-button'
    );
    this.$seekBar = getElementByClassName(this.el, 'better-player__seek-bar');
    this.$duration = getElementByClassName(this.el, 'better-player__duration');
    this.$currentTime = getElementByClassName(
      this.el,
      'better-player__current-time'
    );
    this.$volumeBar = getElementByClassName(
      this.el,
      'better-player__volume-bar'
    );
    this.$muteToggleButton = getElementByClassName(
      this.el,
      'better-player__mute-toggle-button'
    );
    this.$fullscreenToggleButton = getElementByClassName(
      this.el,
      'better-player__fullscreen-toggle-button'
    );
  }

  /**
   * 하위 엘리먼트를 렌더링하고 core 엘리먼트에 자신을 추가한다.
   *
   * @returns {Controller}
   */
  render() {
    // 비디오 엘리먼트의 비디오가 재생 가능한 상태가 아닐 경우(NoVideo 경우 등) 자신을 렌더링하지 않는다.
    if (!this.video.canPlay) return;

    innerHTML(this.el, template());
    this.cacheElements();
    appendChild(this.core.el, this.el);
    return this;
  }
}
