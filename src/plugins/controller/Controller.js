/** @module plugins/controller */

import './Controller.scss';
import UIPlugin from '../../base/ui-plugin';
import {
  appendChild,
  getElementByClassName,
  innerHTML,
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
    this.video.on(Events.VIDEO_PLAY, this.updatePlayToggleButton, this);
    this.video.on(Events.VIDEO_PAUSE, this.updatePlayToggleButton, this);
    this.video.on(Events.VIDEO_TIMEUPDATE, this.onTimeupdate, this);
    this.video.on(Events.VIDEO_DURATIONCHANGE, this.updateDuration, this);
    this.video.on(Events.VIDEO_VOLUMECHANGE, this.updateVolumeBar, this);
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
   * 비디오의 재생 여부에 따라서 토글 버튼의 아이콘을 변경한다.
   */
  updatePlayToggleButton() {
    if (this.video.isPaused()) {
      this.$playToggleButton.classList.remove(
        'better-player__toggle-button--pressed'
      );
    } else {
      this.$playToggleButton.classList.add(
        'better-player__toggle-button--pressed'
      );
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
   * volume bar를 비디오의 볼륨을 바탕으로 변경한다.
   */
  updateVolumeBar() {
    const volume = this.video.getVolume();
    this.$volumeBar.value = volume;
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
