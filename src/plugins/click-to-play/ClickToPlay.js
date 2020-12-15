/** @module plugins/click-to-play */

import Events from '../../base/events';
import Plugin from '../../base/plugin';

/**
 * 비디오 클릭으로 재생/일시정지를 할 수 있는 플러그인
 *
 * @extends Plugin
 */
export default class ClickToPlay extends Plugin {
  /**
   * 비디오에 클릭 이벤트 리스너를 등록한다.
   */
  addEventListeners() {
    this.listenTo(this.video, Events.VIDEO_CLICK, this.onClick);
    this.listenTo(this.video, Events.VIDEO_ERROR, this.disable);
  }

  /**
   * 비디오가 재생상태일 경우 일시정지를 하며 일시 정지 상태일 경우 재생한다.
   */
  onClick() {
    if (this.video.isPaused()) {
      this.video.play();
    } else {
      this.video.pause();
    }
  }
}
