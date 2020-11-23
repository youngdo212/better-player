/** @module components/video-factory */

import Events from '../../base/events';
import HTMLVideo from '../html-video';
import NoVideo from '../no-video/NoVideo';

const videos = [HTMLVideo, NoVideo];

/**
 * 비디오를 생성하는 팩토리 클래스
 *
 * @extends Events
 */
export default class VideoFactory extends Events {
  /**
   * 인스턴스를 생성한다
   *
   * @param {object} config
   * @param {object} config.source
   * @param {object} config.i18n
   */
  constructor(config) {
    super();
    this.config = config;
  }

  /**
   * 설정에서 제공한 비디오 리소스의 포맷을 지원하는 Video 클래스의 인스턴스를 생성한다.
   * 해당 포맷을 지원하는 비디오가 전혀 없을 경우 NoVideo의 인스턴스가 생성된다.
   *
   * @returns {module:base/video}
   */
  create() {
    const [video] = videos.filter(video => video.canPlay(this.config.source));

    return new video(this.config);
  }
}
