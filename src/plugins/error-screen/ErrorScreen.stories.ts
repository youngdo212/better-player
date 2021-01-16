import Events from '../../base/events';
import UIObject from '../../base/ui-object';
import Video from '../../base/video';
import Core from '../../components/core';
import config from '../../config/defaults';
import { Config } from '../../types';
import loadSprite from '../../utils/load-sprite';
import ErrorScreen from './ErrorScreen';

export default {
  title: 'Error Screen',
};

/**
 * NOTE: ErrorScreen은 테스트하기 전에 빌드를 해야합니다(svg sprite 불러오기 위해).
 * `npm run build` 커맨드를 통해 빌드를 한 후 storybook을 실행시키세요.
 */

/**
 * 기본 에러 화면을 렌더링한다.
 */
export const Default = ({ text }: { text: string }): HTMLElement => {
  class MockVideo extends Video {}
  class MockCore extends UIObject<'div'> {
    public video: Video;
    constructor(config: Config) {
      super('div');
      this.video = new MockVideo(config);
    }
  }
  const core = new MockCore(config) as Core;
  core.el.style.position = 'relative';
  core.el.style.width = '640px';
  core.el.style.height = '360px';
  core.el.style.background = '#ccc';
  core.el.style.color = '#fff';
  const errorScreen = new ErrorScreen(core);

  errorScreen.render();
  loadSprite('better-player.svg');

  core.video.emit(Events.VIDEO_ERROR, { message: text });

  return core.el;
};
Default.args = {
  text: config.i18n.notFoundVideo,
};
