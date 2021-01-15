/** @module plugins/controller */

import type { Attributes, EventHandlerNameMap } from '../../types';
import type Core from '../../components/core';
import './Controller.scss';
import UIPlugin from '../../base/ui-plugin';
import {
  addClass,
  appendChild,
  innerHTML,
  removeClass,
  getElementsBySelectorMap,
} from '../../utils/element';
import template from './template';
import Events from '../../base/events';
import formatTime from '../../utils/time';

interface ChildElementNameMap {
  playToggleButton: HTMLElement;
  muteToggleButton: HTMLElement;
  fullscreenToggleButton: HTMLElement;
  seekBar: HTMLInputElement;
  volumeBar: HTMLInputElement;
  currentTime: HTMLElement;
  duration: HTMLElement;
}

/**
 * 비디오 플레이어를 조작하는 UI 플러그인
 *
 * @extends UIPlugin
 */
export default class Controller extends UIPlugin {
  /**
   * 캐싱될 자식 엘리먼트 집합
   */
  public childElements: ChildElementNameMap | null = null;

  /**
   * seek bar를 드래그 중인지 나타내는 값
   */
  private isDraggingSeekBar = false;

  /**
   * seek 작업 수행 후 비디오를 플레이할 지를 나타내는 값
   */
  private playOnSeeked = false;

  /**
   * 하위 엘리먼트를 찾는데 사용할 셀렉터의 집합
   */
  private get selectors(): Record<keyof ChildElementNameMap, string> {
    return {
      playToggleButton: '[data-play-toggle]',
      muteToggleButton: '[data-mute-toggle]',
      fullscreenToggleButton: '[data-fullscreen-toggle]',
      seekBar: '[data-seek-bar]',
      volumeBar: '[data-volume-bar]',
      currentTime: '[data-current-time]',
      duration: '[data-duration]',
    };
  }

  public get attributes(): Attributes {
    return {
      class: 'better-player__controller',
    };
  }

  public get events(): EventHandlerNameMap {
    const {
      playToggleButton,
      muteToggleButton,
      fullscreenToggleButton,
      seekBar,
      volumeBar,
    } = this.selectors;

    return {
      [`click ${playToggleButton}`]: 'togglePlay',
      [`click ${seekBar}`]: 'seek',
      [`click ${muteToggleButton}`]: 'toggleMute',
      [`click ${fullscreenToggleButton}`]: 'toggleFullscreen',
      [`mousedown ${seekBar}`]: 'startSeekDrag',
      [`input ${seekBar}`]: 'updateCurrentTime',
      [`input ${volumeBar}`]: 'setVolume',
    };
  }

  /**
   * 인스턴스를 생성한다.
   */
  constructor(core: Core) {
    super(core);
  }

  /**
   * 컴포넌트에 이벤트 리스너를 등록한다.
   */
  protected addEventListeners(): void {
    this.listenTo(this.video, Events.VIDEO_PLAY, this.updatePlayToggleButton);
    this.listenTo(this.video, Events.VIDEO_PAUSE, this.updatePlayToggleButton);
    this.listenTo(this.video, Events.VIDEO_TIMEUPDATE, this.onTimeupdate);
    this.listenTo(this.video, Events.VIDEO_DURATIONCHANGE, this.updateDuration);
    this.listenTo(this.video, Events.VIDEO_VOLUMECHANGE, this.onVolumeChange);
    this.listenTo(this.video, Events.VIDEO_ERROR, this.disable);
    this.listenTo(
      this.core,
      Events.CORE_FULLSCREENCHANGE,
      this.updateFullscreenToggleButton,
    );
  }

  /**
   * 비디오가 정지된 상태일 경우 비디오를 재생시키고, 재생 중인 경우 일시 정지시킨다.
   */
  private togglePlay(): void {
    this.video.isPaused() ? this.play() : this.pause();
  }

  /**
   * 비디오를 재생시킨다.
   */
  private play(): void {
    this.video.play();
  }

  /**
   * 비디오를 일시 정지시킨다.
   */
  private pause(): void {
    this.video.pause();
  }

  /**
   * seek bar의 드래그를 시작한다.
   */
  private startSeekDrag(): void {
    if (!this.video.isPaused()) {
      this.video.pause();
      this.playOnSeeked = true;
    }
    this.isDraggingSeekBar = true;
  }

  /**
   * 비디오 시간을 seek bar를 바탕으로 변경한다.
   */
  private seek(): void {
    assertIsChildElementsDefined(this.childElements);

    const duration = this.video.getDuration();
    const time = Number(this.childElements.seekBar.value) * duration;

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
  private setVolume(): void {
    assertIsChildElementsDefined(this.childElements);

    const volume = Number(this.childElements.volumeBar.value);
    this.video.setVolume(volume);
  }

  /**
   * 비디오의 볼륨이 없을 경우 음소거를 해제하고, 반대의 경우 음소거한다.
   */
  private toggleMute(): void {
    this.video.getVolume() ? this.mute() : this.unmute();
  }

  /**
   * 비디오를 음소거한다.
   */
  private mute(): void {
    this.video.mute();
  }

  /**
   * 비디오 음소거를 해제한다.
   */
  private unmute(): void {
    this.video.unmute();
  }

  /**
   * 비디오 플레이어를 전체 화면으로 전환시키고, 이미 전체 화면인 경우
   * 전체 화면에서 탈출시킨다
   */
  private toggleFullscreen(): void {
    this.core.isFullscreen() ? this.exitFullscreen() : this.requestFullscreen();
  }

  /**
   * 비디오 플레이어를 전체 화면으로 전환한다.
   */
  private requestFullscreen(): void {
    this.core.requestFullscreen();
  }

  /**
   * 비디오 플레이어의 전체 화면을 해제한다.
   */
  private exitFullscreen(): void {
    this.core.exitFullscreen();
  }

  /**
   * 비디오의 재생 여부에 따라서 토글 버튼의 아이콘을 변경한다.
   */
  private updatePlayToggleButton(): void {
    assertIsChildElementsDefined(this.childElements);

    if (this.video.isPaused()) {
      removeClass(
        this.childElements.playToggleButton,
        'better-player__toggle-button--pressed',
      );
    } else {
      addClass(
        this.childElements.playToggleButton,
        'better-player__toggle-button--pressed',
      );
    }
  }

  /**
   * 비디오의 현재 시간에 따라서 seek bar의 value를 변경한다.
   */
  private updateSeekBar(): void {
    assertIsChildElementsDefined(this.childElements);
    if (this.isDraggingSeekBar) return; // seek bar를 드래그 중인 경우 업데이트하지 않는다.

    const duration = this.video.getDuration();
    const currentTime = this.video.getCurrentTime();
    const position = currentTime / duration;
    const value = isNaN(position) ? 0 : position;

    this.childElements.seekBar.value = value.toString();
  }

  /**
   * 영상의 총 길이를 업데이트한다.
   */
  private updateDuration(): void {
    assertIsChildElementsDefined(this.childElements);

    const duration = this.video.getDuration() || 0;
    this.childElements.duration.textContent = formatTime(duration);
  }

  /**
   * seek bar의 위치를 바탕으로 현재 시간을 변경한다
   */
  private updateCurrentTime(): void {
    assertIsChildElementsDefined(this.childElements);

    const duration = this.video.getDuration() || 0;
    const currentTime = Number(this.childElements.seekBar.value) * duration;
    this.childElements.currentTime.textContent = formatTime(currentTime);
  }

  /**
   * 비디오의 시간 변경 이벤트를 처리한다.
   * seek bar와 현재 시간을 업데이트한다.
   */
  private onTimeupdate(): void {
    this.updateSeekBar();
    this.updateCurrentTime();
  }

  /**
   * 비디오의 볼륨이 변경되었을 때 컨트롤러 볼륨 관련 UI를 변경한다.
   */
  private onVolumeChange(): void {
    this.updateVolumeBar();
    this.updateMuteToggleButton();
  }

  /**
   * volume bar를 비디오의 볼륨을 바탕으로 변경한다.
   */
  private updateVolumeBar(): void {
    assertIsChildElementsDefined(this.childElements);

    const volume = this.video.getVolume();
    this.childElements.volumeBar.value = volume.toString();
  }

  /**
   * 비디오의 볼륨이 0이면 음소거 버튼으로, 그렇지 않은 경우 비음소거 버튼으로 변경한다.
   */
  private updateMuteToggleButton(): void {
    assertIsChildElementsDefined(this.childElements);

    const volume = this.video.getVolume();
    if (volume === 0) {
      addClass(
        this.childElements.muteToggleButton,
        'better-player__toggle-button--pressed',
      );
    } else {
      removeClass(
        this.childElements.muteToggleButton,
        'better-player__toggle-button--pressed',
      );
    }
  }

  /**
   * 전체화면인 경우 전체 화면 탈출 버튼으로, 그렇지 않은 경우 전체 화면 버튼으로 변경한다.
   */
  private updateFullscreenToggleButton(): void {
    assertIsChildElementsDefined(this.childElements);

    if (this.core.isFullscreen()) {
      addClass(
        this.childElements.fullscreenToggleButton,
        'better-player__toggle-button--pressed',
      );
    } else {
      removeClass(
        this.childElements.fullscreenToggleButton,
        'better-player__toggle-button--pressed',
      );
    }
  }

  /**
   * 자식 엘리먼트를 캐싱한다
   */
  private cacheChildElements(): void {
    const childElements = getElementsBySelectorMap(this.el, this.selectors);
    assertIsValidChildElements(childElements);
    this.childElements = childElements;
  }

  /**
   * 하위 엘리먼트를 렌더링하고 core 엘리먼트에 자신을 추가한다.
   *
   * @returns {Controller}
   */
  public render(): Controller {
    innerHTML(this.el, template());
    this.cacheChildElements();
    appendChild(this.core.el, this.el);
    return this;
  }
}

/**
 * childElements가 존재하는지 확인한다
 */
function assertIsChildElementsDefined<T>(
  childElements: T,
): asserts childElements is NonNullable<T> {
  if (childElements === undefined || childElements === null) {
    throw new Error(
      `expected controller.childElements to be defined, but received ${childElements}`,
    );
  }
}

// TODO: 리팩토링
/**
 * childElements 객체의 value가 올바른지 확인한다.
 */
function assertIsValidChildElements(
  childElements: Record<keyof ChildElementNameMap, HTMLElement | null>,
): asserts childElements is ChildElementNameMap {
  const {
    playToggleButton,
    muteToggleButton,
    fullscreenToggleButton,
    seekBar,
    volumeBar,
    currentTime,
    duration,
  } = childElements;

  if (
    playToggleButton instanceof HTMLElement &&
    muteToggleButton instanceof HTMLElement &&
    fullscreenToggleButton instanceof HTMLElement &&
    seekBar instanceof HTMLInputElement &&
    volumeBar instanceof HTMLInputElement &&
    currentTime instanceof HTMLElement &&
    duration instanceof HTMLElement
  )
    return;

  throw new Error('invalid controller childElement property');
}
