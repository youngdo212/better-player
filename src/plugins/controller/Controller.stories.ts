import loadSprite from '../../utils/load-sprite';
import Controller from './Controller';
import config from '../../config/defaults';
import HTMLVideo from '../../components/html-video';
import Core from '../../components/core';
import UIObject from '../../base/ui-object';
import Video from '../../base/video';
import { Config } from '../../types';

export default {
  title: 'Controller',
};

/**
 * NOTE: Controller를 테스트하기 전에 빌드를 해야합니다(svg sprite 불러오기 위해).
 * `npm run build` 커맨드를 통해 빌드를 한 후 storybook을 실행시키세요.
 */

const Template = () => {
  class MockCore extends UIObject<'div'> {
    public video: Video;
    constructor(config: Config) {
      super('div');
      this.video = new HTMLVideo(config);
    }
  }
  const core = new MockCore({
    ...config,
    source:
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  }) as Core;
  core.el.style.position = 'relative';
  core.el.style.width = '640px';
  core.el.style.height = '360px';
  core.el.style.background = '#ccc';
  const controller = new Controller(core);

  controller.render();
  loadSprite('better-player.svg');

  return core.el;
};

export const Default = Template.bind({});
