/** @module components/no-video */

import type { Attributes, Config } from '../../types';
import './NoVideo.scss';
import Video from '../../base/video';
import { defer } from '../../utils/function';
import Events from '../../base/events';

/**
 * 지원하지 않는 비디오 포맷을 리소스로 사용하거나 리소스를 아예 제공하지
 * 않을 경우 렌더링되는 mock 비디오
 * @extends Video
 */
export default class NoVideo extends Video {
  get attributes(): Attributes {
    return { class: 'better-player__no-video' };
  }

  /**
   * 인스턴스를 생성한 후 VIDEO_ERROR 이벤트를 발생시킨다
   */
  constructor(config: Config) {
    super(config);
    this.throwError();
  }

  /**
   * VIDEO_ERROR 이벤트를 비동기적으로 발생시킨다
   */
  private throwError(): void {
    defer(() => {
      const error = {
        message: this.config.i18n.notSupportVideoFormat,
      };
      this.emit(Events.VIDEO_ERROR, error);
    });
  }

  /**
   * 비디오를 리로드하면 다시 VIDEO_ERROR 에러를 발생시킨다.
   */
  reload(): void {
    this.throwError();
  }

  /**
   * 재생 가능한 비디오 소스인지를 확인합니다.
   * NoVideo의 경우 어떤 비디오 소스인지 관심 없으므로 항상 true를 반환합니다.
   */
  static canPlayType(source: string): boolean {
    return true;
  }
}
