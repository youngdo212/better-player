import Core from '../../components/core';
import config from '../../config/defaults';
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
export const Default = ({ text }) => {
  const core = new Core({
    ...config,
    i18n: {
      notFoundVideo: text,
    },
  });
  core.el.style.position = 'relative';
  core.el.style.width = '640px';
  core.el.style.height = '360px';
  core.el.style.background = '#ccc';
  const errorScreen = new ErrorScreen(core);

  errorScreen.render();
  loadSprite('better-player.svg');

  return core.el;
};
Default.args = {
  text: config.i18n.notFoundVideo,
};
