/** @module plugins/click-to-play */

import Events from '../../base/events';
import Plugin from '../../base/plugin';
import Core from '../../components/core';

/**
 * 비디오 클릭으로 재생/일시정지를 할 수 있는 플러그인
 *
 * @extends Plugin
 */
export default class ClickToPlay extends Plugin {
  /**
   * 인스턴스를 생성하고 환경 설정에 clickToPlay 옵션이 false일 경우 비활성화한다.
   */
  constructor(core: Core) {
    super(core);
    if (!core.config.clickToPlay) {
      this.disable();
    }
  }

  /**
   * 비디오에 클릭 이벤트 리스너를 등록한다.
   */
  protected addEventListeners(): void {
    this.listenTo(this.video, Events.VIDEO_CLICK, this.onClick);
    this.listenTo(this.video, Events.VIDEO_ERROR, this.disable);
  }

  /**
   * 비디오가 재생상태일 경우 일시정지를 하며 일시 정지 상태일 경우 재생한다.
   */
  private onClick(): void {
    if (this.video.isPaused()) {
      this.video.play();
    } else {
      this.video.pause();
    }
  }

  /**
   * clickToPlay 옵션이 꺼져있을 경우 enable할 수 없다.
   */
  public enable(): void {
    if (!this.core.config.clickToPlay) return;
    super.enable();
  }
}
