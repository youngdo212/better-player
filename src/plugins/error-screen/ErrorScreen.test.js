import Core from '../../components/core';
import config from '../../config/defaults';
import ErrorScreen from './ErrorScreen';

it('올바른 클래스 속성을 가진다', () => {
  const core = new Core(config);
  const errorScreen = new ErrorScreen(core);

  expect(errorScreen.el.className).toBe('better-player__error-screen');
});

it('렌더링을 올바르게 수행한다', () => {
  const core = new Core(config);
  const errorScreen = new ErrorScreen(core);

  errorScreen.render();

  expect(core.el.children).toContain(errorScreen.el);
  expect(
    errorScreen.el.querySelector('.better-player__error-screen-message')
  ).toBeDefined();
});
