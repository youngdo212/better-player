import loadSprite from '../../utils/load-sprite';
import Controller from './Controller';

export default {
  title: 'Controller',
};

/**
 * NOTE: Controller를 테스트하기 전에 빌드를 해야합니다(svg sprite 불러오기 위해).
 * `npm run build` 커맨드를 통해 빌드를 한 후 storybook을 실행시키세요.
 */

const Template = () => {
  const mockCoreEl = document.createElement('div');
  mockCoreEl.style.position = 'relative';
  mockCoreEl.style.width = '640px';
  mockCoreEl.style.height = '360px';
  mockCoreEl.style.background = '#ccc';
  const mockCore = { el: mockCoreEl };
  const controller = new Controller(mockCore); // eslint-disable-line no-unused-vars
  loadSprite('better-player.svg');

  return mockCoreEl;
};

export const Default = Template.bind({});
